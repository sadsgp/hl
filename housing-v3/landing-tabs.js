(() => {
  const analysis = document.getElementById('project-analysis');
  const reset = document.getElementById('resetRequests')?.closest('section');
  const scenario = document.querySelector('.landing > .note.strong');
  if (!analysis || !reset || !scenario) return;
  const spacer = scenario.nextElementSibling;
  const warning = spacer?.nextElementSibling;
  const print = document.querySelector('.analysis-print');
  const shell = document.createElement('section');
  shell.className = 'landing-tabs';
  const nav = document.createElement('div');
  nav.className = 'landing-tab-list';
  nav.setAttribute('role', 'tablist');
  nav.setAttribute('aria-label', 'راهنما و ابزارهای نمونه');
  shell.append(nav);
  scenario.before(shell);
  const bpmn = document.getElementById('analysis-bpmn');
  const prototypes = document.getElementById('analysis-form-prototypes');
  if (bpmn && prototypes && bpmn.contains(prototypes)) analysis.append(prototypes);
  if (bpmn) {
    bpmn.open = true;
    bpmn.querySelector('summary').textContent = 'نمودار BPMN · گردش درخواست تسهیلات مسکن';
  }
  const roles = document.querySelector('.landingcards');
  const entries = [
    ['پروتوتایپ تعاملی', [roles]],
    ['سند تحلیل پروژه', [document.getElementById('business-analysis')]],
    ['سند تحلیلی جهت توسعه دهنده', [print, analysis]],
    ['نمودار گردش فرآیند BPMN', [bpmn]],
    ['مدل روابط داده ERD', [document.getElementById('analysis-erd')]],
    ['سناریو تست سریع', [scenario, spacer, warning, reset]]
  ];
  const buttons = [];
  const panels = [];
  function activate(index, focus = false) {
    buttons.forEach((button, i) => {
      button.setAttribute('aria-selected', String(i === index));
      button.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (index === 4) {
      const diagram = document.querySelector('#erd-diagram .mermaid');
      if (diagram && !diagram.dataset.processed && !diagram.dataset.rendering) {
        document.getElementById('analysis-erd').open = true;
        diagram.dataset.rendering = 'true';
        requestAnimationFrame(() => requestAnimationFrame(async () => {
          try {
            await document.fonts.ready;
            await mermaid.run({nodes: [diagram]});
          } catch (error) {
            console.error('ERD rendering failed', error);
          } finally {
            delete diagram.dataset.rendering;
          }
        }));
      }
    }
    if (focus) buttons[index].focus();
  }
  entries.forEach(([title, nodes], index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.id = `landing-tab-${index}`;
    const icons = ['▦', '▤', '⌘', '⇄', '◇', '✓'];
    const descriptions = ['ورود به شش کارتابل و اجرای گردش تسهیلات', 'نیازمندی‌ها، قواعد و تحلیل فرایند پروژه', 'جزئیات فنی و راهنمای پیاده‌سازی', 'مشاهده مدل استاندارد گردش درخواست', 'ساختار داده‌ها و ارتباط موجودیت‌ها', 'راهنمای آزمون و پاک‌سازی اطلاعات آزمایشی'];
    const icon = document.createElement('span');
    icon.className = 'landing-box-icon'; icon.textContent = icons[index]; icon.setAttribute('aria-hidden', 'true');
    const label = document.createElement('strong'); label.textContent = title;
    const description = document.createElement('span'); description.className = 'landing-box-description'; description.textContent = descriptions[index];
    button.append(icon, label, description);
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `landing-panel-${index}`);
    const panel = document.createElement('div');
    panel.id = `landing-panel-${index}`;
    panel.className = 'landing-tab-panel';
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', button.id);
    nodes.filter(Boolean).forEach(node => panel.append(node));
    buttons.push(button);
    panels.push(panel);
    nav.append(button);
    shell.append(panel);
    button.addEventListener('click', () => {
      if (index === 0) { window.location.href = 'prototype.html'; return; }
      activate(index); panel.scrollIntoView({behavior: 'smooth', block: 'start'});
    });
    button.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowLeft') target = (index + 1) % entries.length;
      if (event.key === 'ArrowRight') target = (index + entries.length - 1) % entries.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = entries.length - 1;
      if (target !== undefined) { event.preventDefault(); activate(target, true); }
    });
  });
  document.querySelector('a[href="#analysis-erd"]')?.addEventListener('click', () => activate(4));
  buttons.forEach((button, i) => {
    button.setAttribute('aria-selected', 'false');
    button.tabIndex = i === 0 ? 0 : -1;
    panels[i].hidden = true;
  });
})();
