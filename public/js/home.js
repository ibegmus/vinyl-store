const collections = [
  { title: 'Новинки', img: '/img/covers/cat-vinyl.svg', href: 'catalog.html?sort=new' },
  { title: 'Хиты продаж', img: '/img/covers/cat-turntables.svg', href: 'catalog.html?sort=popular' },
  { title: 'Предзаказ', img: '/img/covers/cat-accessories.svg', href: 'catalog.html?status=preorder' },
  { title: 'Скидки', img: '/img/covers/cat-giftcards.svg', href: 'catalog.html?discount=1' }
];

const editorial = [
  {
    img: '/img/covers/genre-classic-rock.svg',
    title: 'Золотая эра рока',
    text: 'Переиздания культовых альбомов 70-х на виниле 180 грамм. Ремастеринг с оригинальных лент, оригинальная полиграфия.'
  },
  {
    img: '/img/covers/genre-jazz.svg',
    title: 'Джазовые вечера',
    text: 'Blue Note Classics, audiophile-прессование и тишина между нотами. Всё, что нужно для медленного воскресения.'
  },
  {
    img: '/img/covers/genre-electronic.svg',
    title: 'Синтезаторы и пульсы',
    text: 'От берлинского техно до уютного лоу-фая. Электронная музыка, которая звучит лучше всего именно на виниле.'
  }
];

function renderCollections() {
  document.getElementById('collectionTiles').innerHTML = collections.map(c => `
    <a class="tile" href="${c.href}">
      <img src="${c.img}" alt="${esc(c.title)}">
      <span class="tile-count">→</span>
      <span class="tile-label">${esc(c.title)}</span>
    </a>`).join('');
}

function renderEditorial() {
  document.getElementById('editorialGrid').innerHTML = editorial.map(e => `
    <article class="editorial-card">
      <img src="${e.img}" alt="${esc(e.title)}">
      <div class="editorial-body">
        <h3>${esc(e.title)}</h3>
        <p>${esc(e.text)}</p>
      </div>
    </article>`).join('');
}

async function loadNewArrivals() {
  const box = document.getElementById('newArrivals');
  try {
    const data = await api('/albums?sort=new&limit=8');
    if (!data.items.length) {
      box.innerHTML = '<p style="color:var(--muted)">Пока пусто.</p>';
      return;
    }
    box.innerHTML = data.items.map(albumCard).join('');
  } catch (e) {
    box.innerHTML = `<p style="color:#ef476f;padding:20px 0">${esc(e.message)}</p>`;
  }
}

async function loadBestsellers() {
  const box = document.getElementById('bestGrid');
  try {
    const data = await api('/albums?sort=popular&limit=8');
    box.innerHTML = data.items.length ? data.items.map(albumCard).join('') : '<p style="color:var(--muted)">Нет данных.</p>';
  } catch (e) {
    box.innerHTML = `<p style="color:#ef476f;padding:20px 0">${esc(e.message)}</p>`;
  }
}

async function loadGenres() {
  const box = document.getElementById('genreGrid');
  try {
    const genres = await api('/genres');
    box.innerHTML = genres.filter(g => g.count > 0).map(g => `
      <a class="genre-tile" href="catalog.html?genre=${encodeURIComponent(g.slug)}">
        <img src="${esc(g.cover)}" alt="${esc(g.name)}">
        <span>${esc(g.name)}<small>${g.count} пластинок</small></span>
      </a>`).join('');
  } catch (e) {
    box.innerHTML = `<p style="color:#ef476f;padding:20px 0">${esc(e.message)}</p>`;
  }
}

function initCarouselNav() {
  document.querySelectorAll('[data-carousel]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const delta = target.clientWidth * 0.85;
      target.scrollBy({ left: btn.dataset.carousel === 'next' ? delta : -delta, behavior: 'smooth' });
    });
  });
}

function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (track && !track.dataset.duplicated) {
    track.innerHTML += track.innerHTML;
    track.dataset.duplicated = '1';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCollections();
  renderEditorial();
  loadNewArrivals();
  loadBestsellers();
  loadGenres();
  initCarouselNav();
  initMarquee();
});
