const urlParams = new URLSearchParams(location.search);

const state = {
  search: '',
  genre: urlParams.get('genre') || '',
  status: urlParams.get('status') || '',
  format: '',
  sort: urlParams.get('sort') || 'popular',
  minPrice: '',
  maxPrice: '',
  discount: urlParams.get('discount') === '1'
};

function buildQuery() {
  const q = new URLSearchParams();
  if (state.search) q.set('search', state.search);
  if (state.genre) q.set('genre', state.genre);
  if (state.status) q.set('status', state.status);
  if (state.format) q.set('format', state.format);
  if (state.sort) q.set('sort', state.sort);
  if (state.minPrice !== '') q.set('minPrice', state.minPrice);
  if (state.maxPrice !== '') q.set('maxPrice', state.maxPrice);
  if (state.discount) q.set('discount', '1');
  return q.toString();
}

async function loadGenres() {
  try {
    const genres = await api('/genres');
    document.getElementById('genreChips').innerHTML =
      `<button class="chip" data-genre="">Все</button>` +
      genres.filter(g => g.count > 0).map(g =>
        `<button class="chip" data-genre="${esc(g.slug)}">${esc(g.name)}</button>`
      ).join('');
    syncChips();
  } catch (e) {
    console.error(e);
  }
}

function syncChips() {
  document.querySelectorAll('#genreChips .chip').forEach(c => c.classList.toggle('active', c.dataset.genre === state.genre));
  document.querySelectorAll('#statusChips .chip').forEach(c => c.classList.toggle('active', c.dataset.status === state.status));
  document.querySelectorAll('#formatChips .chip').forEach(c => c.classList.toggle('active', c.dataset.format === state.format));
  document.getElementById('discountOnly').checked = state.discount;
  document.getElementById('sortSelect').value = state.sort;
}

async function loadCatalog() {
  const grid = document.getElementById('catalogGrid');
  const count = document.getElementById('catalogCount');
  try {
    const data = await api('/albums?' + buildQuery());
    count.innerHTML = `Найдено: <b>${data.total}</b> ${plural(data.total)}`;
    if (!data.items.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <h3>Ничего не найдено</h3>
          <p>Попробуйте изменить запрос или сбросить фильтры.</p>
          <button class="btn btn-outline btn-sm" id="resetFilters">Сбросить фильтры</button>
        </div>`;
      document.getElementById('resetFilters').addEventListener('click', resetFilters);
      return;
    }
    grid.innerHTML = data.items.map(albumCard).join('');
  } catch (e) {
    count.textContent = 'Ошибка загрузки';
    grid.innerHTML = `<p style="color:#ef476f;padding:20px 0">${esc(e.message)}</p>`;
  }
}

function plural(n) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'пластинка';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'пластинки';
  return 'пластинок';
}

function resetFilters() {
  Object.assign(state, { search: '', genre: '', status: '', format: '', sort: 'popular', minPrice: '', maxPrice: '', discount: false });
  document.getElementById('searchInput').value = '';
  document.getElementById('minPrice').value = '';
  document.getElementById('maxPrice').value = '';
  syncChips();
  updateUrl();
  loadCatalog();
}

function updateUrl() {
  const q = buildQuery();
  history.replaceState(null, '', location.pathname + (q ? '?' + q : ''));
}

let searchTimer;
function onSearchInput() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.search = document.getElementById('searchInput').value.trim();
    updateUrl();
    loadCatalog();
  }, 350);
}

function initFilters() {
  const searchInput = document.getElementById('searchInput');
  searchInput.value = state.search;
  searchInput.addEventListener('input', onSearchInput);

  document.getElementById('genreChips').addEventListener('click', e => {
    const chip = e.target.closest('[data-genre]');
    if (!chip) return;
    state.genre = chip.dataset.genre;
    syncChips(); updateUrl(); loadCatalog();
  });

  document.getElementById('statusChips').addEventListener('click', e => {
    const chip = e.target.closest('[data-status]');
    if (!chip) return;
    state.status = chip.dataset.status;
    syncChips(); updateUrl(); loadCatalog();
  });

  document.getElementById('formatChips').addEventListener('click', e => {
    const chip = e.target.closest('[data-format]');
    if (!chip) return;
    state.format = chip.dataset.format;
    syncChips(); updateUrl(); loadCatalog();
  });

  const priceHandler = () => {
    state.minPrice = document.getElementById('minPrice').value;
    state.maxPrice = document.getElementById('maxPrice').value;
    updateUrl();
    clearTimeout(searchTimer);
    searchTimer = setTimeout(loadCatalog, 500);
  };
  document.getElementById('minPrice').addEventListener('input', priceHandler);
  document.getElementById('maxPrice').addEventListener('input', priceHandler);

  document.getElementById('discountOnly').addEventListener('change', e => {
    state.discount = e.target.checked;
    updateUrl();
    loadCatalog();
  });

  document.getElementById('sortSelect').addEventListener('change', e => {
    state.sort = e.target.value;
    updateUrl();
    loadCatalog();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  loadGenres().then(loadCatalog);
});
