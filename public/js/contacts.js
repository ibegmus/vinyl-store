async function loadFaqs() {
  const list = document.getElementById('faqList');
  try {
    const faqs = await api('/faqs');
    list.innerHTML = faqs.map(f => `
      <div class="faq-item">
        <button class="faq-q" type="button">
          ${esc(f.question)}
          <svg class="faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div class="faq-a"><div class="faq-a-inner">${esc(f.answer)}</div></div>
      </div>`).join('');
  } catch (e) {
    list.innerHTML = `<p style="color:#ef476f">${esc(e.message)}</p>`;
  }
}

function initFaqAccordion() {
  document.getElementById('faqList').addEventListener('click', e => {
    const btn = e.target.closest('.faq-q');
    if (!btn) return;
    const item = btn.parentElement;
    const answer = item.querySelector('.faq-a');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(other => {
      other.classList.remove('open');
      other.querySelector('.faq-a').style.maxHeight = '0px';
    });
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
  if (location.hash === '#faq') {
    setTimeout(() => {
      const first = document.querySelector('#faqList .faq-q');
      if (first) first.click();
    }, 600);
  }
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const msg = document.getElementById('contactMsg');
    const data = Object.fromEntries(new FormData(form).entries());
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    const oldText = btn.textContent;
    btn.textContent = 'Отправляем…';
    try {
      const res = await api('/contacts', { method: 'POST', body: JSON.stringify(data) });
      form.reset();
      toast(res.message, 'success');
      msg.textContent = '';
    } catch (err) {
      msg.textContent = err.message;
      toast(err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = oldText;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadFaqs();
  initFaqAccordion();
  initContactForm();
});
