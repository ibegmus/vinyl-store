const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const seed = require('./seed-data');

const dataDir = path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'vinyl.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS genres (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      sort INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      tagline TEXT DEFAULT '',
      sort INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS albums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      artist TEXT NOT NULL,
      genre_id INTEGER REFERENCES genres(id),
      year INTEGER,
      price INTEGER NOT NULL,
      old_price INTEGER,
      format TEXT DEFAULT 'LP',
      label TEXT DEFAULT '',
      description TEXT DEFAULT '',
      stock INTEGER DEFAULT 0,
      status TEXT DEFAULT 'in_stock',
      rating REAL DEFAULT 0,
      sold INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tracks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      album_id INTEGER NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
      position INTEGER NOT NULL,
      title TEXT NOT NULL,
      duration TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      album_id INTEGER NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
      author TEXT NOT NULL,
      rating INTEGER NOT NULL,
      text TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT DEFAULT '',
      message TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT DEFAULT '',
      address TEXT DEFAULT '',
      total INTEGER NOT NULL,
      status TEXT DEFAULT 'new',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      album_id INTEGER NOT NULL REFERENCES albums(id),
      quantity INTEGER NOT NULL,
      price INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      sort INTEGER DEFAULT 0
    );
  `);
}

function seedIfEmpty() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM albums').get().c;
  if (count > 0) return;

  const insertGenre = db.prepare('INSERT INTO genres (slug, name, sort) VALUES (?, ?, ?)');
  const insertCategory = db.prepare('INSERT INTO categories (slug, name, tagline, sort) VALUES (?, ?, ?, ?)');
  const insertAlbum = db.prepare(`INSERT INTO albums
    (slug, title, artist, genre_id, year, price, old_price, format, label, description, stock, status, rating, sold)
    VALUES (@slug, @title, @artist, @genre_id, @year, @price, @old_price, @format, @label, @description, @stock, @status, @rating, @sold)`);
  const insertTrack = db.prepare('INSERT INTO tracks (album_id, position, title, duration) VALUES (?, ?, ?, ?)');
  const insertFaq = db.prepare('INSERT INTO faqs (question, answer, sort) VALUES (?, ?, ?)');
  const insertReview = db.prepare('INSERT INTO reviews (album_id, author, rating, text) VALUES (?, ?, ?, ?)');

  const tx = db.transaction(() => {
    const genreIds = {};
    for (const g of seed.genres) {
      const info = insertGenre.run(g.slug, g.name, g.sort);
      genreIds[g.slug] = info.lastInsertRowid;
    }
    for (const c of seed.categories) {
      insertCategory.run(c.slug, c.name, c.tagline, c.sort);
    }

    const reviewSamples = [
      [5, 'Алексей', 'Пластинка пришла в идеальном состоянии, звук потрясающий. Рекомендую!'],
      [5, 'Марина', 'Моя любимая запись зазвучала по-новому. Прессование без посторонних шумов.'],
      [4, 'Дмитрий', 'Хорошее качество полиграфии, немного задержали отправку, но пластинка того стоила.'],
      [5, 'Ольга', 'Покупала в подарок — винтажный конверт и уход в комплекте очень обрадовали.'],
      [4, 'Игорь', 'Звук отличный, но конверт был с потёртостями. В целом доволен.']
    ];

    for (const a of seed.albums) {
      const info = insertAlbum.run({
        slug: a.slug, title: a.title, artist: a.artist,
        genre_id: genreIds[a.genre], year: a.year, price: a.price,
        old_price: a.oldPrice || null, format: a.format, label: a.label,
        description: a.description, stock: a.stock, status: a.status,
        rating: a.rating, sold: a.sold
      });
      const albumId = info.lastInsertRowid;
      a.tracks.forEach((t, i) => insertTrack.run(albumId, i + 1, t[0], t[1]));
      if (a.status === 'in_stock' && a.rating > 0) {
        const picks = [0, 1, 2].map(k => reviewSamples[(a.slug.length + k) % reviewSamples.length]);
        for (const [r, author, text] of picks) {
          insertReview.run(albumId, `${author} ${String.fromCharCode(65 + (a.slug.length % 26))}.`, r, text);
        }
      }
    }

    for (const f of seed.faqs) insertFaq.run(f.question, f.answer, f.sort);
  });

  tx();
}

initSchema();
seedIfEmpty();

module.exports = db;
