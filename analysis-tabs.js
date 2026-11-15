(() => {
  const routes = {
    'acceptance.html': ['analysis-acceptance', 'معیارهای پذیرش پروژه'],
    'fields.html': ['analysis-fields', 'پیشنهاد نام گذاری و تعیین نوع فیلدها'],
    'forms.html': ['analysis-form-prototypes', 'فرمهای پروتوتایپ فاقد تعامل']
  };
  const legacy = {acceptance: 'acceptance.html', fields: 'fields.html', forms: 'forms.html'};
  function render() {
    const file = location.pathname.split('/').pop();
    const destination = legacy[location.hash.slice(1)];
    if (file === 'project-analysis.html' && destination) {
      location.replace(destination);
      return;
    }
    const [id, title] = routes[file] || ['business-analysis', 'سند تحلیل پروژه'];
    document.querySelectorAll('.analysis-tab-list').forEach(node => node.remove());
    ['business-analysis', 'analysis-acceptance', 'analysis-fields', 'analysis-form-prototypes'].forEach(panelId => {
      const panel = document.getElementById(panelId);
      if (!panel) return;
      if (panelId !== id) { panel.remove(); return; }
      panel.hidden = false;
      panel.removeAttribute('role');
      panel.removeAttribute('aria-labelledby');
    });
    const heading = document.querySelector('h1');
    if (heading) heading.textContent = title;
    document.title = title + ' | تسهیلات مسکن';
  }
  render();
  window.addEventListener('hashchange', render);
})();
