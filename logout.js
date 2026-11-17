'use strict';
document.getElementById('logout-button')?.addEventListener('click', function () {
  sessionStorage.removeItem('housing-demo-auth-v75');
  sessionStorage.removeItem('housing-demo-access-v182');
  location.replace('start.html');
});
