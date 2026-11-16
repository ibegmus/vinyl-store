const API = '/api';

async function api(path, options = {}) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  let data = null;
  try { data = await res.json(); } catch (e) { data = null; }
  if (!res.ok) {
    const err = new Error((data && data.error) || `Ошибка ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function fmtPrice(n) {
  return Number(n).toLocaleString('ru-RU') + ' ₽';
}

function stars(rating) {
  const full = Math.round(Number(rating) || 0);
  let out = '';
  for (let i = 1; i <= 5; i++) out += i <= full ? '★' : '☆';
  return `<span class="rating-stars">${out}</span>`;
}

function statusBadge(a) {
  if (a.status === 'preorder') return '<span class="badge badge-preorder">Предзаказ</span>';
  if (a.status === 'sold_out' || a.stock <= 0) return '<span class="badge badge-out">Нет в наличии</span>';
  if (a.oldPrice) return '<span class="badge badge-discount">−' + Math.round((1 - a.price / a.oldPrice) * 100) + '%</span>';
  if (a.sold > 200) return '<span class="badge badge-new">Хит</span>';
  return '';
}

function albumCard(a) {
  const disabled = a.status === 'preorder' || a.stock > 0 ? '' : 'disabled';
  return `
    <article class="album-card" data-slug="${esc(a.slug)}">
      <a href="product.html?slug=${encodeURIComponent(a.slug)}" class="album-media">
        <span class="album-badges">${statusBadge(a)}</span>
        <img class="cover" src="${esc(a.cover)}" alt="${esc(a.title)} — ${esc(a.artist)}" loading="lazy" onerror="this.onerror=null;this.src='/img/covers/${a.slug}.svg'">
        <span class="album-disc"></span>
      </a>
      <div class="album-info">
        <a href="product.html?slug=${encodeURIComponent(a.slug)}">
          <h3 class="album-title">${esc(a.title)}</h3>
          <p class="album-artist">${esc(a.artist)}</p>
        </a>
        <div class="album-foot">
          <span class="price">${a.oldPrice ? `<s>${fmtPrice(a.oldPrice)}</s>` : ''}<span class="now">${fmtPrice(a.price)}</span></span>
          <button class="add-cart" data-add="${esc(a.slug)}" title="В корзину" ${disabled}>${icons.plus}</button>
        </div>
      </div>
    </article>`;
}

const icons = {
  search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  cart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.6"/><circle cx="17" cy="20" r="1.6"/><path d="M3 3h2l2.6 12.4a1 1 0 0 0 1 .6h8.9a1 1 0 0 0 1-.8L20 7H6"/></svg>',
  plus: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  arrowLeft: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5m7-7-7 7 7 7"/></svg>',
  arrowRight: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>',
  check: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m4.5 12.5 5 5 10-11"/></svg>',
  mail: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  phone: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>',
  pin: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  clock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  vk: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.9 17.5c-5.6 0-8.8-3.8-8.9-10.2h2.8c.1 4.7 2.2 6.7 3.9 7.1V7.3h2.6v4.1c1.7-.2 3.4-2.1 4-4.1h2.6c-.4 2.5-2.2 4.4-3.5 5.1 1.3.6 3.3 2.2 4 5.1h-2.9c-.6-1.6-2-2.9-4-3v3Z"/></svg>',
  telegram: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.5 4.3 2.9 11.5c-1.1.4-1.1 1.1-.2 1.4l4.7 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.5-2.4 4.8 3.6c.9.5 1.5.2 1.7-.8l3-14.5c.3-1.2-.5-1.7-1.5-1.4ZM8.6 13.9l9.6-6.1c.5-.3.9-.1.5.2l-8.2 7.4-.3 3.4-1.6-4.9Z"/></svg>',
  youtube: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.5 7.2a3 3 0 0 0-2.1-2.1C18.6 4.6 12 4.6 12 4.6s-6.6 0-8.4.5A3 3 0 0 0 1.5 7.2 31 31 0 0 0 1 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.8.5 8.4.5 8.4.5s6.6 0 8.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23 12a31 31 0 0 0-.5-4.8ZM9.8 15.3V8.7L15.7 12l-5.9 3.3Z"/></svg>',
  instagram: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none"/></svg>',
  note: '<svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>'
};

function toast(message, type = '') {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.innerHTML = `${type === 'success' ? icons.check : ''}<span>${esc(message)}</span>`;
  wrap.appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 320);
  }, 2800);
}

function getCart() {
  try { return JSON.parse(localStorage.getItem('rechords_cart')) || []; } catch (e) { return []; }
}

function saveCart(items) {
  localStorage.setItem('rechords_cart', JSON.stringify(items));
  updateCartBadge();
}

function updateCartBadge() {
  const items = getCart();
  const total = items.reduce((s, i) => s + i.quantity, 0);
  const badge = document.querySelector('.cart-count');
  if (badge) {
    badge.textContent = total;
    badge.classList.toggle('visible', total > 0);
  }
}

async function addToCart(slug, quantity = 1, silent = false) {
  try {
    const album = await api(`/albums/${encodeURIComponent(slug)}`);
    const cart = getCart();
    const found = cart.find(i => i.slug === slug);
    if (found) found.quantity += quantity;
    else cart.push({ slug, quantity });
  saveCart(cart);
  updateCartBadge();
  if (!silent) toast(`«${album.title}» добавлена в корзину`, 'success');
  renderCartItems();
  return true;
  } catch (e) {
    toast(e.message || 'Не удалось добавить товар', 'error');
    return false;
  }
}

function removeFromCart(slug) {
  saveCart(getCart().filter(i => i.slug !== slug));
  renderCartItems();
  updateCartBadge();
}

function openCart() {
  renderCartItems();
  document.getElementById('overlay').classList.add('show');
  document.getElementById('cartDrawer').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('overlay').classList.remove('show');
  document.getElementById('cartDrawer').classList.remove('show');
  document.body.style.overflow = '';
}

async function renderCartItems() {
  const body = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  const cart = getCart();
  if (!body) return;

  if (!cart.length) {
    body.innerHTML = `<div class="cart-empty">${icons.note}<p>Корзина пуста</p><p style="font-size:13px">Загляните в каталог — там много винила.</p></div>`;
    foot.style.display = 'none';
    return;
  }

  foot.style.display = '';
  const results = await Promise.allSettled(cart.map(i => api(`/albums/${encodeURIComponent(i.slug)}`)));
  const valid = [];
  const invalidSlugs = [];
  results.forEach((r, idx) => {
    if (r.status === 'fulfilled') valid.push({ album: r.value, quantity: cart[idx].quantity });
    else invalidSlugs.push(cart[idx].slug);
  });
  if (invalidSlugs.length) {
    saveCart(cart.filter(i => !invalidSlugs.includes(i.slug)));
    updateCartBadge();
  }

  let total = 0;
  body.innerHTML = valid.map(({ album, quantity }) => {
    total += album.price * quantity;
    return `
      <div class="cart-item">
        <img src="${esc(album.cover)}" alt="${esc(album.title)}" onerror="this.onerror=null;this.src='/img/covers/${album.slug}.svg'">
        <div>
          <div class="cart-item-title">${esc(album.title)}</div>
          <div class="cart-item-artist">${esc(album.artist)}</div>
          <div class="cart-item-qty">${quantity} × ${fmtPrice(album.price)}</div>
        </div>
        <div>
          <div class="cart-item-price">${fmtPrice(album.price * quantity)}</div>
          <button class="cart-remove" data-remove="${esc(album.slug)}" title="Убрать">${icons.close}</button>
        </div>
      </div>`;
  }).join('');

  document.getElementById('cartTotal').textContent = fmtPrice(total);
}

function initChrome() {
  updateCartBadge();

  const burger = document.querySelector('.burger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
  }

  document.querySelectorAll('[data-open-cart]').forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault();
    openCart();
  }));

  document.getElementById('overlay').addEventListener('click', closeCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);

  document.getElementById('cartItems').addEventListener('click', e => {
    const rm = e.target.closest('[data-remove]');
    if (rm) removeFromCart(rm.dataset.remove);
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

  document.addEventListener('click', async e => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    e.preventDefault();
    const ok = await addToCart(btn.dataset.add, 1);
    if (ok) {
      btn.classList.add('added');
      btn.innerHTML = icons.check;
      setTimeout(() => { btn.classList.remove('added'); btn.innerHTML = icons.plus; }, 1200);
    }
  });

  document.querySelectorAll('.subscribe-form').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const msg = form.parentElement.querySelector('.form-note');
      try {
        const res = await api('/subscribe', { method: 'POST', body: JSON.stringify({ email: input.value }) });
        input.value = '';
        toast(res.message || 'Вы подписаны!', 'success');
        if (msg) { msg.textContent = res.message || 'Готово!'; msg.style.color = 'var(--ok)'; }
      } catch (err) {
        toast(err.message, 'error');
        if (msg) { msg.textContent = err.message; msg.style.color = '#ef476f'; }
      }
    });
  });

  initCheckout();
}

async function initCheckout() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const cart = getCart();
    if (!cart.length) return;
    const btn = form.querySelector('button[type="submit"]');
    const oldText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" style="width:18px;height:18px;margin:0;border-width:2px"></span>';
    const fields = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await api('/orders', {
        method: 'POST',
        body: JSON.stringify({
          customer: { name: fields.name, email: fields.email, phone: fields.phone, address: fields.address },
          items: cart.map(i => ({ slug: i.slug, quantity: i.quantity }))
        })
      });
      saveCart([]);
      document.getElementById('cartItems').innerHTML = `
        <div class="checkout-success">
          <div class="ok-ring">${icons.check.replace('width="18"', 'width="34"').replace('height="18"', 'height="34"')}</div>
          <h3 style="font-family:var(--font-display);font-size:24px;text-transform:uppercase;margin-bottom:10px">Заказ оформлен!</h3>
          <p style="color:var(--muted);font-size:14px">${esc(res.message)}</p>
          <p style="color:var(--muted);font-size:13px;margin-top:10px">Мы свяжемся с вами для подтверждения.</p>
        </div>`;
      document.getElementById('cartFoot').style.display = 'none';
      form.style.display = 'none';
      setTimeout(() => { closeCart(); form.reset(); form.style.display = ''; document.getElementById('cartFoot').style.display = ''; }, 4000);
    } catch (err) {
      toast(err.message, 'error');
      btn.disabled = false;
      btn.innerHTML = oldText;
    }
  });
}

document.addEventListener('DOMContentLoaded', initChrome);
