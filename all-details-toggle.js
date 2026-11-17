(() => {
  // Interactive forms already have their own group control.
  const controllers = new Map();
  const initialized = new WeakSet();
  function scopeFor(detail) {
    if (detail.closest('#content') && document.querySelector('script[src*="form-details-toggle.js"]')) return null;
    return detail.closest('[role="tabpanel"]') || detail.closest('main') || document.body;
  }
  function paint(controller) {
    const {button, expanded} = controller;
    const icon = expanded ? '⇈' : '⇊';
    if (button.textContent !== icon) button.textContent = icon;
    const label = expanded ? 'بستن همه کشویی‌های این بخش' : 'باز کردن همه کشویی‌های این بخش';
    button.title = label;
    button.setAttribute('aria-label', label);
    button.setAttribute('aria-expanded', String(expanded));
  }
  function sync() {
    const groups = new Map();
    document.querySelectorAll('details').forEach(detail => {
      const scope = scopeFor(detail);
      if (!scope) return;
      if (!groups.has(scope)) groups.set(scope, []);
      groups.get(scope).push(detail);
    });
    controllers.forEach((controller, scope) => {
      if (!scope.isConnected || !groups.has(scope)) {controller.bar.remove(); controllers.delete(scope);}
    });
    groups.forEach((details, scope) => {
      let controller = controllers.get(scope);
      if (!controller) {
        const bar = document.createElement('div');
        bar.className = 'all-details-toolbar';
        bar.style.cssText = 'display:inline-flex;vertical-align:middle;direction:rtl;margin:0 12px 0 0';
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'btn all-details-toggle';
        button.style.cssText = 'width:34px;height:34px;min-width:34px;padding:0;display:inline-flex;align-items:center;justify-content:center;font-size:20px;line-height:1;border-radius:9px;flex:none;cursor:pointer;pointer-events:auto;background:linear-gradient(135deg,#0891b2,#0f766e);color:#fff;border:1px solid #0e7490;box-shadow:0 2px 6px #0891b233;vertical-align:middle';
        controller = {bar, button, expanded:false, details};
        button.addEventListener('click', () => {
          controller.userToggled = true;
          controller.expanded = !controller.expanded;
          controller.details.forEach(detail => {detail.open = controller.expanded;});
          paint(controller);
        });
        bar.append(button);
        const heading = Array.from(scope.querySelectorAll('h1,h2,h3,h4')).find(h => !h.closest('details') && (h.closest('[role="tabpanel"]') || h.closest('main') || document.body) === scope);
        if (heading) heading.append(bar); else scope.prepend(bar);
        controllers.set(scope, controller);
      }
      controller.details = details;
      details.forEach(detail => {
        if (!initialized.has(detail)) {initialized.add(detail); detail.open = controller.expanded || (!controller.userToggled && details.indexOf(detail) === 0 && /\/(bpmn|erd|fields)\.html$/.test(location.pathname));}
      });
      paint(controller);
    });
  }
  new MutationObserver(sync).observe(document.body, {childList:true, subtree:true, attributes:true, attributeFilter:['hidden', 'role']});
  sync();
})();
