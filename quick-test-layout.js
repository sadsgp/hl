(() => {
  const heading = document.querySelector('main.landing > h1');
  const resetPanel = document.querySelector('.reset-panel');
  if (heading && resetPanel) heading.after(resetPanel);
})();
