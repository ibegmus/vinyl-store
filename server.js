const express = require('express');
const path = require('path');
const db = require('./src/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '256kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function mapAlbum(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    artist: row.artist,
    year: row.year,
    price: row.price,
    oldPrice: row.old_price,
    format: row.format,
    label: row.label,
    description: row.description,
    stock: row.stock,
    status: row.status,
    rating: row.rating,
    sold: row.sold,
    cover: `/img/albums/${row.id}.jpg`,
    genre: row.genre_name,
    genreSlug: row.genre_slug
  };
}

function getTracks(albumId) {
  return db.prepare('SELECT position, title, duration FROM tracks WHERE album_id = ? ORDER BY position').all(albumId);
}

function getReviews(albumId) {
  return db.prepare('SELECT author, rating, text, created_at FROM reviews WHERE album_id = ? ORDER BY id DESC LIMIT 20').all(albumId);
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/stats', (req, res) => {
  const albums = db.prepare('SELECT COUNT(*) AS c FROM albums').get().c;
  const genres = db.prepare('SELECT COUNT(*) AS c FROM genres').get().c;
  const sold = db.prepare('SELECT COALESCE(SUM(sold), 0) AS s FROM albums').get().s;
  const subscribers = db.prepare('SELECT COUNT(*) AS c FROM subscribers').get().c;
  const orders = db.prepare('SELECT COUNT(*) AS c FROM orders').get().c;
  res.json({ albums, genres, sold, subscribers, orders });
});

app.get('/api/genres', (req, res) => {
  const rows = db.prepare(`
    SELECT g.id, g.slug, g.name, COUNT(a.id) AS count
    FROM genres g LEFT JOIN albums a ON a.genre_id = g.id
    GROUP BY g.id ORDER BY g.sort
  `).all();
  res.json(rows.map(g => ({ ...g, cover: `/img/covers/genre-${g.slug}.svg` })));
});

app.get('/api/categories', (req, res) => {
  const rows = db.prepare('SELECT id, slug, name, tagline FROM categories ORDER BY sort').all();
  res.json(rows.map(c => ({ ...c, cover: `/img/covers/cat-${c.slug}.svg` })));
});

app.get('/api/faqs', (req, res) => {
  res.json(db.prepare('SELECT id, question, answer FROM faqs ORDER BY sort').all());
});

app.get('/api/albums', (req, res) => {
  const { search = '', genre = '', status = '', format = '', sort = 'popular', minPrice = '', maxPrice = '', discount = '', limit = '48', offset = '0' } = req.query;
  const where = [];
  const params = {};

  if (discount === '1') where.push('a.old_price IS NOT NULL');

  if (search.trim()) {
    where.push('(a.title LIKE @search OR a.artist LIKE @search OR a.label LIKE @search)');
    params.search = `%${search.trim()}%`;
  }
  if (genre) { where.push('g.slug = @genre'); params.genre = genre; }
  if (status) { where.push('a.status = @status'); params.status = status; }
  if (format) { where.push('a.format = @format'); params.format = format; }
  if (minPrice !== '') { where.push('a.price >= @minPrice'); params.minPrice = Number(minPrice); }
  if (maxPrice !== '') { where.push('a.price <= @maxPrice'); params.maxPrice = Number(maxPrice); }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const orderBy = {
    popular: 'a.sold DESC, a.rating DESC',
    new: 'a.created_at DESC, a.id DESC',
    price_asc: 'a.price ASC',
    price_desc: 'a.price DESC',
    rating: 'a.rating DESC, a.sold DESC',
    year: 'a.year DESC'
  }[sort] || 'a.sold DESC';

  const lim = Math.min(Math.max(parseInt(limit, 10) || 48, 1), 96);
  const off = Math.max(parseInt(offset, 10) || 0, 0);

  const base = `FROM albums a LEFT JOIN genres g ON g.id = a.genre_id ${whereSql}`;
  const total = db.prepare(`SELECT COUNT(*) AS c ${base}`).get(params).c;
  const rows = db.prepare(`SELECT a.*, g.name AS genre_name, g.slug AS genre_slug ${base} ORDER BY ${orderBy} LIMIT @lim OFFSET @off`)
    .all({ ...params, lim, off });

  res.json({ total, count: rows.length, items: rows.map(mapAlbum) });
});

app.get('/api/albums/:slug', (req, res) => {
  const row = db.prepare('SELECT a.*, g.name AS genre_name, g.slug AS genre_slug FROM albums a LEFT JOIN genres g ON g.id = a.genre_id WHERE a.slug = ?').get(req.params.slug);
  if (!row) return res.status(404).json({ error: 'Альбом не найден' });
  const album = mapAlbum(row);
  album.tracks = getTracks(row.id);
  album.reviews = getReviews(row.id);
  album.related = db.prepare(`
    SELECT a.*, g.name AS genre_name, g.slug AS genre_slug FROM albums a
    LEFT JOIN genres g ON g.id = a.genre_id
    WHERE a.genre_id = ? AND a.id != ?
    ORDER BY a.rating DESC LIMIT 6
  `).all(row.genre_id, row.id).map(mapAlbum);
  res.json(album);
});

app.post('/api/albums/:slug/reviews', (req, res) => {
  const row = db.prepare('SELECT id FROM albums WHERE slug = ?').get(req.params.slug);
  if (!row) return res.status(404).json({ error: 'Альбом не найден' });
  const author = String(req.body.author || '').trim();
  const text = String(req.body.text || '').trim();
  const rating = parseInt(req.body.rating, 10);
  if (!author || author.length > 60) return res.status(400).json({ error: 'Укажите имя (до 60 символов)' });
  if (!text || text.length > 1000) return res.status(400).json({ error: 'Напишите отзыв (до 1000 символов)' });
  if (!(rating >= 1 && rating <= 5)) return res.status(400).json({ error: 'Оценка должна быть от 1 до 5' });

  const info = db.prepare('INSERT INTO reviews (album_id, author, rating, text) VALUES (?, ?, ?, ?)').run(row.id, author, rating, text);
  const avg = db.prepare('SELECT AVG(rating) AS r FROM reviews WHERE album_id = ?').get(row.id).r;
  db.prepare('UPDATE albums SET rating = ? WHERE id = ?').run(Math.round((avg || rating) * 10) / 10, row.id);
  res.status(201).json({ id: info.lastInsertRowid, author, rating, text, created_at: new Date().toISOString() });
});

app.post('/api/subscribe', (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return res.status(400).json({ error: 'Введите корректный email' });
  try {
    db.prepare('INSERT INTO subscribers (email) VALUES (?)').run(email);
    res.status(201).json({ ok: true, message: 'Готово! Теперь вы будете получать лучшие предложения.' });
  } catch (e) {
    if (String(e.message).includes('UNIQUE')) {
      return res.json({ ok: true, message: 'Вы уже подписаны на рассылку.' });
    }
    throw e;
  }
});

app.post('/api/contacts', (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim();
  const subject = String(req.body.subject || '').trim();
  const message = String(req.body.message || '').trim();
  if (!name || name.length > 80) return res.status(400).json({ error: 'Укажите имя' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return res.status(400).json({ error: 'Введите корректный email' });
  if (!message || message.length < 5 || message.length > 2000) return res.status(400).json({ error: 'Сообщение должно быть от 5 до 2000 символов' });
  const info = db.prepare('INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)').run(name, email, subject, message);
  res.status(201).json({ id: info.lastInsertRowid, ok: true, message: 'Сообщение отправлено. Мы ответим в течение дня.' });
});

app.post('/api/orders', (req, res) => {
  const customer = req.body.customer || {};
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const name = String(customer.name || '').trim();
  const email = String(customer.email || '').trim();
  const phone = String(customer.phone || '').trim();
  const address = String(customer.address || '').trim();
  if (!name) return res.status(400).json({ error: 'Укажите имя получателя' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return res.status(400).json({ error: 'Введите корректный email' });
  if (!address || address.length < 5) return res.status(400).json({ error: 'Укажите адрес доставки' });
  if (!items.length) return res.status(400).json({ error: 'Корзина пуста' });

  const tx = db.transaction(() => {
    const albumStmt = db.prepare('SELECT id, slug, title, price, stock, status FROM albums WHERE slug = ?');
    let total = 0;
    const prepared = [];
    for (const item of items) {
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const album = albumStmt.get(String(item.slug));
      if (!album) throw Object.assign(new Error('Товар не найден'), { status: 400 });
      if (album.status === 'sold_out' || album.stock <= 0) throw Object.assign(new Error(`«${album.title}» нет в наличии`), { status: 400 });
      total += album.price * qty;
      prepared.push({ id: album.id, title: album.title, quantity: qty, price: album.price });
    }
    const info = db.prepare('INSERT INTO orders (customer_name, email, phone, address, total, status) VALUES (?, ?, ?, ?, ?, ?)')
      .run(name, email, phone, address, total, 'new');
    const orderId = info.lastInsertRowid;
    const itemStmt = db.prepare('INSERT INTO order_items (order_id, album_id, quantity, price) VALUES (?, ?, ?, ?)');
    const decStmt = db.prepare('UPDATE albums SET stock = stock - ? WHERE id = ? AND stock >= ?');
    for (const p of prepared) {
      itemStmt.run(orderId, p.id, p.quantity, p.price);
      decStmt.run(p.quantity, p.id, p.quantity);
    }
    return { orderId, total };
  });

  try {
    const result = tx();
    res.status(201).json({ ok: true, orderId: result.orderId, total: result.total, message: `Заказ #${result.orderId} принят! Сумма: ${result.total.toLocaleString('ru-RU')} ₽` });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Не удалось оформить заказ' });
  }
});

app.use('/api', (req, res) => res.status(404).json({ error: 'Маршрут не найден' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
  console.log(`Vinyl store running at http://localhost:${PORT}`);
});
