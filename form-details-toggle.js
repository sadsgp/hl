(() => {
  const content = document.getElementById('content');
  if (!content) return;
  let form = null, expanded = false;
  const seen = new WeakSet();
  function sync() {
    const next = document.getElementById('formBody');
    if (!next) { form = null; expanded = false; return; }
    if (next !== form) { form = next; expanded = false; }
    content.querySelectorAll('details').forEach(detail => {
      if (!seen.has(detail)) { seen.add(detail); detail.open = expanded; }
    });
    let button = content.querySelector('#toggleAllFormDetails');
    if (!button) {
      const bar = document.createElement('div');
      bar.className = 'actions';
      bar.style.cssText = 'display:inline-flex;vertical-align:middle;direction:rtl;margin:0 12px 0 0';
      button = document.createElement('button');
      button.id = 'toggleAllFormDetails'; button.type = 'button'; button.className = 'btn';
      button.style.cssText = 'width:34px;height:34px;min-width:34px;padding:0;display:inline-flex;align-items:center;justify-content:center;font-size:20px;line-height:1;border-radius:9px;flex:none;background:linear-gradient(135deg,#0891b2,#0f766e);color:#fff;border:1px solid #0e7490;box-shadow:0 2px 6px #0891b233;vertical-align:middle';
      button.addEventListener('click', () => {
        expanded = !expanded;
        content.querySelectorAll('details').forEach(detail => { detail.open = expanded; });
        update(button);
      });
      bar.append(button);
      const heading = form.closest('.card')?.querySelector('.cardhead h2') || form.querySelector('h1,h2,h3,h4');
      if (heading) heading.append(bar); else form.prepend(bar);
    }
    update(button);
  }
  function update(button) {
    const icon = expanded ? '⇈' : '⇊';
    if (button.textContent !== icon) button.textContent = icon;
    const label = expanded ? 'بستن همه کشویی‌ها' : 'باز کردن همه کشویی‌ها';
    button.setAttribute('aria-label', label);
    button.setAttribute('aria-expanded', String(expanded));
    button.title = label;
  }
  new MutationObserver(sync).observe(content, {childList: true, subtree: true});
  sync();
})();
