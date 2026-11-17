(() => {
  if (new URLSearchParams(location.search).get('entry') !== 'home') return;
  const card = document.querySelector('.rolecard[href="admin.html"]');
  if (!card) return;
  const hint = document.createElement('p');
  hint.className = 'home-start-hint';
  hint.textContent = 'جهت شروع فرایند یک درخواست تسهیلات برای متقاضی ثبت نمایید';
  hint.setAttribute('role', 'note');
  card.querySelector('h2').after(hint);
  function fitHint() {
    hint.style.fontSize = '10px';
    let size = 10;
    while (hint.scrollWidth > hint.clientWidth && size > 6) {
      size -= 0.25;
      hint.style.fontSize = size + 'px';
    }
  }
  requestAnimationFrame(fitHint);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitHint);
  if (window.ResizeObserver) new ResizeObserver(fitHint).observe(card);
  else window.addEventListener('resize', fitHint);
})();
