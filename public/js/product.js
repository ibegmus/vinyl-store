const slug = new URLSearchParams(location.search).get('slug');
let currentRating = 5;
let albumCache = null;

function stockInfo(a) {
  if (a.status === 'preorder') return `<span class="stock-line stock-pre"><span class="stock-dot" style="background:#ffd166"></span>Предзаказ — отправим в день релиза</span>`;
  if (a.stock <= 0) return `<span class="stock-line stock-out"><span class="stock-dot" style="background:#ef476f"></span>Нет в наличии</span>`;
  return `<span class="stock-line stock-in"><span class="stock-dot" style="background:var(--ok)"></span>В наличии${a.stock <= 3 ? ` — осталось ${a.stock} шт.` : ''}</span>`;
}

function renderProduct(a) {
  const canBuy = a.stock > 0 || a.status === 'preorder';
  document.getElementById('crumbTitle').textContent = a.title;
  document.title = `${a.title} — ${a.artist} | RECHORDS`;
  document.getElementById('productLayout').innerHTML = `
    <div class="product-media">
      <span class="album-badges">${statusBadge(a)}</span>
      <img src="${esc(a.cover)}" alt="${esc(a.title)} — ${esc(a.artist)}">
    </div>
    <div class="product-info">
      <a href="catalog.html?genre=${encodeURIComponent(a.genreSlug)}" style="font-size:12px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--accent)">${esc(a.genre || 'Разное')}</a>
      <h1>${esc(a.title)}</h1>
      <div class="product-artist">${esc(a.artist)}</div>
      <div style="display:flex;align-items:center;gap:12px;margin-top:10px">${stars(a.rating)}<span style="color:var(--muted);font-size:13px">${a.rating.toFixed(1)} · ${a.sold} продаж</span></div>

      <div class="product-meta">
        <div><b>${a.year}</b>год</div>
        <div><b>${esc(a.format)}</b>формат</div>
        <div><b>${esc(a.label)}</b>лейбл</div>
        <div><b>REC-${String(a.id).padStart(4, '0')}</b>артикул</div>
      </div>

      <p class="product-desc">${esc(a.description)}</p>

      <div class="product-buy">
        <div class="buy-price">
          <span class="price">${a.oldPrice ? `<s>${fmtPrice(a.oldPrice)}</s>` : ''}<span class="now">${fmtPrice(a.price)}</span></span>
          ${a.oldPrice ? `<span class="badge badge-discount">−${Math.round((1 - a.price / a.oldPrice) * 100)}%</span>` : ''}
        </div>
        <div class="qty-row">
          <div class="qty">
            <button type="button" id="qtyMinus" aria-label="Меньше">−</button>
            <input type="text" id="qtyInput" value="1" inputmode="numeric" aria-label="Количество">
            <button type="button" id="qtyPlus" aria-label="Больше">+</button>
          </div>
          <button class="btn btn-accent" id="addToCartBtn" ${canBuy ? '' : 'disabled style="opacity:.4;cursor:not-allowed"'}>В корзину</button>
        </div>
        ${stockInfo(a)}
      </div>

      <h2 style="font-family:var(--font-display);font-size:24px;text-transform:uppercase;letter-spacing:.5px">Трек-лист</h2>
      <div class="tracklist">
        ${a.tracks.map(t => `
          <div class="track">
            <span class="track-num">${String(t.position).padStart(2, '0')}</span>
            <span class="track-name">${esc(t.title)}</span>
            <span class="track-dur">${esc(t.duration)}</span>
          </div>`).join('')}
      </div>

      <div class="reviews-head">
        <h2>Отзывы (${a.reviews.length})</h2>
      </div>
      <div id="reviewsList">${renderReviews(a.reviews)}</div>

      <form class="review-form" id="reviewForm">
        <h3>Оставить отзыв</h3>
        <div class="form-grid">
          <div class="form-row">
            <div class="field">
              <label>Ваше имя</label>
              <input type="text" name="author" maxlength="60" placeholder="Как вас зовут?" required>
            </div>
            <div class="field">
              <label>Оценка</label>
              <div class="stars-input" id="starsInput">
                ${[1, 2, 3, 4, 5].map(i => `<button type="button" data-star="${i}" class="${i <= currentRating ? 'on' : ''}">★</button>`).join('')}
              </div>
            </div>
          </div>
          <div class="field">
            <label>Отзыв</label>
            <textarea name="text" rows="3" maxlength="1000" placeholder="Расскажите о качестве записи и полиграфии…" required></textarea>
            <div class="field-msg" id="reviewMsg"></div>
          </div>
          <div><button type="submit" class="btn btn-dark">Отправить отзыв</button></div>
        </div>
      </form>
    </div>`;
}

function renderReviews(reviews) {
  if (!reviews.length) return '<p style="color:var(--muted);padding:8px 0 16px">Отзывов пока нет — станьте первым.</p>';
  return reviews.map(r => `
    <div class="review">
      <div class="review-top">
        <span class="review-author">${esc(r.author)}</span>
        <span class="rating-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
      </div>
      <p class="review-text">${esc(r.text)}</p>
      <div class="review-date">${new Date(r.created_at).toLocaleDateString('ru-RU')}</div>
    </div>`).join('');
}

async function loadProduct() {
  const layout = document.getElementById('productLayout');
  if (!slug) {
    layout.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><h3>Пластинка не указана</h3><p>Вернитесь в каталог и выберите пластинку.</p><a href="catalog.html" class="btn btn-accent btn-sm">В каталог</a></div>`;
    return;
  }
  try {
    const album = await api(`/albums/${encodeURIComponent(slug)}`);
    albumCache = album;
    renderProduct(album);
    bindProductActions();
    renderRelated(album.related);
  } catch (e) {
    document.getElementById('crumbTitle').textContent = 'Не найдено';
    layout.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><h3>Пластинка не найдена</h3><p>${esc(e.message)}</p><a href="catalog.html" class="btn btn-accent btn-sm">В каталог</a></div>`;
  }
}

function renderRelated(related) {
  const box = document.getElementById('relatedGrid');
  if (!related || !related.length) {
    box.innerHTML = '<p style="color:var(--muted)">Нет похожих пластинок.</p>';
    return;
  }
  box.innerHTML = related.map(albumCard).join('');
}

function bindProductActions() {
  const qtyInput = document.getElementById('qtyInput');
  document.getElementById('qtyMinus').addEventListener('click', () => {
    qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
  });
  document.getElementById('qtyPlus').addEventListener('click', () => {
    qtyInput.value = Math.min(99, (parseInt(qtyInput.value, 10) || 1) + 1);
  });
  qtyInput.addEventListener('change', () => {
    let v = parseInt(qtyInput.value, 10) || 1;
    qtyInput.value = Math.min(99, Math.max(1, v));
  });

  document.getElementById('addToCartBtn').addEventListener('click', async e => {
    const btn = e.currentTarget;
    const qty = Math.min(99, Math.max(1, parseInt(qtyInput.value, 10) || 1));
    const ok = await addToCart(slug, qty);
    if (ok) {
      btn.innerHTML = 'Добавлено ✓';
      setTimeout(() => { btn.innerHTML = 'В корзину'; }, 1400);
    }
  });

  document.getElementById('starsInput').addEventListener('click', e => {
    const star = e.target.closest('[data-star]');
    if (!star) return;
    currentRating = parseInt(star.dataset.star, 10);
    document.querySelectorAll('#starsInput button').forEach(b => b.classList.toggle('on', parseInt(b.dataset.star, 10) <= currentRating));
  });

  document.getElementById('reviewForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.currentTarget;
    const msg = document.getElementById('reviewMsg');
    const data = Object.fromEntries(new FormData(form).entries());
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    try {
      const review = await api(`/albums/${encodeURIComponent(slug)}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ author: data.author, text: data.text, rating: currentRating })
      });
      msg.textContent = '';
      form.reset();
      currentRating = 5;
      document.querySelectorAll('#starsInput button').forEach(b => b.classList.toggle('on', parseInt(b.dataset.star, 10) <= 5));
      document.getElementById('reviewsList').insertAdjacentHTML('afterbegin', renderReviews([review]));
      toast('Спасибо! Отзыв опубликован.', 'success');
    } catch (err) {
      msg.textContent = err.message;
      toast(err.message, 'error');
    } finally {
      btn.disabled = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', loadProduct);
