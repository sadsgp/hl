'use strict';
(function(){function check(){let ok=false;try{ok=sessionStorage.getItem('housing-demo-auth-v75')==='authenticated';}catch(e){}if(!ok){document.documentElement.style.visibility='hidden';location.replace('start.html');return;}document.getElementById('auth-cloak')?.remove();document.documentElement.style.visibility='';}check();window.addEventListener('pageshow',check);})();
