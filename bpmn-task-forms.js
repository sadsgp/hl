(() => {
'use strict';
const forms={register:[1,2],exception:[11],docs:[3],applicant:[4],executive:[5],hrInitial:[6],research:[7],hrFinal:[8],reports:[9],seen:[10],correctRequest:[14],exceptionExecutive:[12],exceptionHR:[13],facilityEvidenceUpload:[15,17],facilityEvidenceReview:[16]};
window.attachBpmnForms=function(registry,container){
 if(!document.getElementById('bpmn-form-style')){
 const style=document.createElement('style');style.id='bpmn-form-style';style.textContent='.bpmn-form-task{cursor:pointer}.bpmn-form-task:hover .djs-visual>rect,.bpmn-form-task:focus .djs-visual>rect{stroke:#2dd4bf!important;stroke-width:5px!important;filter:drop-shadow(0 0 5px #14b8a6)}.bpmn-form-dialog{width:min(1100px,94vw);max-height:90vh;padding:0;border:0;border-radius:18px;background:#fff;color:#172c48;font-family:Vazir,Tahoma,sans-serif;direction:rtl;box-shadow:0 25px 90px #0006}.bpmn-form-dialog::backdrop{background:#071426b3}.bpmn-form-header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid #dce4ec}.bpmn-form-header h2{margin:0;font-size:17px}.bpmn-form-dialog button{font:inherit;border:0;border-radius:9px;padding:8px 14px;cursor:pointer;background:#173c66;color:white}.bpmn-form-body{padding:18px;overflow:auto;max-height:72vh}.bpmn-form-body img{display:block;width:100%;height:auto;margin:12px 0 24px}.bpmn-form-body iframe{width:100%;height:680px;border:1px solid #e2e8f0;border-radius:10px}.bpmn-form-note{font-size:12px;color:#64748b}';document.head.append(style);
 }
 const dialog=document.createElement('dialog');dialog.className='bpmn-form-dialog';dialog.setAttribute('aria-labelledby','bpmn-form-modal-title');dialog.innerHTML='<header class="bpmn-form-header"><h2 id="bpmn-form-modal-title"></h2><button type="button" aria-label="بستن پنجره فرم">✕ بستن</button></header><div class="bpmn-form-body"></div>';
 (container.parentElement||document.body).append(dialog);
 dialog.querySelector('button').onclick=()=>dialog.close();
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{dialog.querySelector('.bpmn-form-body').replaceChildren();});
 registry.getAll().forEach(element=>{
 if(!forms[element.id] || !/Task$/.test(element.type))return;
 const graphic=registry.getGraphics(element);graphic.classList.add('bpmn-form-task');graphic.setAttribute('tabindex','0');graphic.setAttribute('role','button');graphic.setAttribute('aria-haspopup','dialog');
 function open(){
 dialog.querySelector('h2').textContent=element.businessObject.name;
 const body=dialog.querySelector('.bpmn-form-body');body.replaceChildren();
 const note=document.createElement('p');note.className='bpmn-form-note';note.textContent='پیش‌نمایش فرم مرتبط با این فعالیت؛ داده‌ها آزمایشی و فرم‌ها فاقد تعامل هستند.';body.append(note);
 forms[element.id].forEach(n=>{const file='assets/form-prototypes/form-'+String(n).padStart(2,'0')+([10,15,16,17].includes(n)?'.html':'.png');const media=document.createElement(file.endsWith('.html')?'iframe':'img');media.src=file;media.setAttribute(file.endsWith('.html')?'title':'alt','فرم مرتبط با '+element.businessObject.name);body.append(media);});
 dialog.showModal();
 }
 graphic.addEventListener('click',e=>{e.stopPropagation();open();});
 graphic.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
 });
};
})();
