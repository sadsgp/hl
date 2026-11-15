(() => {
  async function render() {
    const diagram = document.querySelector('#erd-diagram .mermaid');
    if (!diagram || diagram.dataset.processed) return;
    try {
      await document.fonts.ready;
      await mermaid.run({ nodes: [diagram] });
    } catch (error) {
      console.error('ERD rendering failed:', error);
      const status = document.createElement('p');
      status.setAttribute('role', 'alert');
      status.textContent = 'نمایش نمودار با خطا مواجه شد. فایل منبع ERD برای دانلود در دسترس است.';
      diagram.before(status);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render, { once: true });
  else render();
})();
