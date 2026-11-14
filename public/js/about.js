function animateCounter(el, target) {
  const duration = 1200;
  const start = performance.now();
  function frame(now) {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased).toLocaleString('ru-RU');
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

async function loadStats() {
  const grid = document.getElementById('statsGrid');
  if (!grid) return;
  try {
    const stats = await api('/stats');
    document.querySelectorAll('[data-stat]').forEach(el => {
      animateCounter(el, stats[el.dataset.stat] || 0);
    });
  } catch (e) {
    document.querySelectorAll('[data-stat]').forEach(el => { el.textContent = '—'; });
  }
}

document.addEventListener('DOMContentLoaded', loadStats);
