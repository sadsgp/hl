'use strict';
let resettingRequests=false;
async function resetLandingRequests(){
 if(resettingRequests)return;
 if(!confirm('تمام درخواست‌ها، مدارک و سوابق ذخیره‌شده در این مرورگر برای تمام نقش‌ها حذف می‌شوند. این کار قابل بازگشت نیست. آیا مطمئن هستید؟'))return;
 resettingRequests=true;const button=document.getElementById('resetRequests');button.disabled=true;const message=document.getElementById('resetMessage');let database;
 try{
 database=await new Promise((resolve,reject)=>{const request=indexedDB.open('gp-housing-orange-v3',1);request.onupgradeneeded=()=>request.result.createObjectStore('requests',{keyPath:'id'});request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
 await new Promise((resolve,reject)=>{const transaction=database.transaction('requests','readwrite');transaction.objectStore('requests').clear();transaction.oncomplete=resolve;transaction.onerror=()=>reject(transaction.error);transaction.onabort=()=>reject(transaction.error);});
 try{localStorage.setItem('gp-housing-orange-v3-signal',Date.now()+':'+Math.random());}catch(e){}
 message.textContent='تمام درخواست‌ها، مدارک و سوابق آزمایشی حذف شدند. اکنون می‌توانید دوباره تست کنید.';
 }catch(e){message.textContent='حذف انجام نشد؛ دسترسی به ذخیره‌سازی مرورگر را بررسی کنید.';}
 finally{if(database)database.close();resettingRequests=false;button.disabled=false;}
}
