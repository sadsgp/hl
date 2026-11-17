'use strict';
(function () {
  const authKey = 'housing-demo-auth-v75';
  const accessKey = 'housing-demo-access-v182';
  const restrictedPages = new Set(['erd.html', 'acceptance.html', 'fields.html']);
  const limitedIndexPages = new Set([
    'developer-analysis.html', 'project-analysis.html', 'prototype.html',
    'forms.html', 'quick-test.html', 'bpmn.html'
  ]);
  function targetPage(link) {
    return new URL(link.getAttribute('href'), location.href).pathname.split('/').pop();
  }
  function applyVisibility(access) {
    if (location.pathname.split('/').pop() !== 'index.html') return;
    if (!document.getElementById('limited-card-style')) {
      const style = document.createElement('style');
      style.id = 'limited-card-style';
      style.textContent = '.landing-tab-list a.project-link.access-locked{position:relative!important;overflow:hidden;cursor:not-allowed;isolation:isolate}.access-locked>*{filter:blur(3px);opacity:.45;pointer-events:none}.landing-tab-list a.project-link.access-locked::after{content:"🔒";position:absolute;inset:0;display:grid;place-items:center;font-size:38px;background:#eef2ff55;z-index:5;filter:none;opacity:1}';
      document.head.append(style);
    }
    document.querySelectorAll('.landing-tab-list a.project-link').forEach(function (link) {
      const locked = access !== 'full' && restrictedPages.has(targetPage(link));
      link.hidden = false;
      link.style.removeProperty('display');
      link.classList.toggle('access-locked', locked);
      if (locked) {
        link.setAttribute('aria-disabled', 'true');
        link.setAttribute('aria-label', link.textContent.trim() + ' — قفل؛ دسترسی محدود');
        link.title = 'این بخش برای سطح دسترسی فعلی قفل است';
      } else {
        link.removeAttribute('aria-disabled');
        link.removeAttribute('aria-label');
        link.removeAttribute('title');
      }
      if (!link.dataset.lockHandler) {
        link.addEventListener('click', function (event) {
          if (link.classList.contains('access-locked')) { event.preventDefault(); event.stopImmediatePropagation(); }
        }, true);
        link.dataset.lockHandler = 'true';
      }
    });
  }
  function check() {
    let authenticated = false;
    let access = null;
    try {
      authenticated = sessionStorage.getItem(authKey) === 'authenticated';
      access = sessionStorage.getItem(accessKey);
    } catch (e) {}
    if (!authenticated || !['full', 'limited'].includes(access)) {
      document.documentElement.style.visibility = 'hidden';
      location.replace('start.html');
      return;
    }
    if (access === 'limited' && restrictedPages.has(location.pathname.split('/').pop())) {
      document.documentElement.style.visibility = 'hidden';
      location.replace('index.html');
      return;
    }
    applyVisibility(access);
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { applyVisibility(access); }, { once: true });
    }
    document.getElementById('auth-cloak')?.remove();
    document.documentElement.style.visibility = '';
  }
  check();
  window.addEventListener('pageshow', check);
})();
