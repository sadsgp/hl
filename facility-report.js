'use strict';
(() => {
 const button=document.getElementById('facilityReportButton');
 if(!button||!['admin','executive','hr','investigation','officer'].includes(ROLE))return;
 const dialog=document.createElement('dialog');
 dialog.className='facility-report';
 dialog.dir='rtl';
 dialog.setAttribute('aria-labelledby','facilityReportTitle');
 dialog.innerHTML='<header><h2 id="facilityReportTitle">گزارش تسهیلات</h2><form method="dialog"><button class="btn facility-report-close" autofocus>بستن</button></form></header><p class="muted" data-report-role></p><div data-report-body aria-live="polite"></div>';
 document.body.append(dialog);
 const body=dialog.querySelector('[data-report-body]');
 dialog.querySelector('[data-report-role]').textContent='کارتابل '+roleInfo[ROLE][0];
 const lastUpdate=r=>Math.max(r.created||0,...(r.history||[]).map(entry=>Number(entry.at)||0));
 const responsibleRole={draft:'admin',unknown:'admin',exception:'admin',exception_executive:'executive',exception_hr:'hr',awaiting_documents:'admin',awaiting_admin_correction:'admin',awaiting_applicant:'applicant',awaiting_executive:'executive',executive_approved:'hr',awaiting_investigation:'investigation',awaiting_hr_review:'hr',awaiting_officer:'officer',awaiting_hr_report:'hr',awaiting_evidence:'admin',evidence_correction:'admin',awaiting_evidence_review:'hr'};
 const closedStates=new Set(['withdrawn','executive_rejected','hr_rejected','completed','exception_closed']);
 function caseActor(r){
  const role=responsibleRole[r.state];
  if(role){
   const name=role==='applicant'?r.person?.name:roleInfo[role]?.[1];
   return 'مسئول: '+(name||roleInfo[role]?.[0]||'—');
  }
  if(closedStates.has(r.state)){
   const action=r.history?.at(-1);
   const name=(r.state==='withdrawn'?r.person?.name:null)||action?.actorName||action?.actor;
   if(name)return 'انجام‌دهنده: '+name;
  }
  return '—';
 }
 const number=new Intl.NumberFormat('fa-IR');
 const date=new Intl.DateTimeFormat('fa-IR',{dateStyle:'short',timeStyle:'short'});
 function show(rows){
  if(!rows.length){body.textContent='در این کارتابل پرونده‌ای برای گزارش وجود ندارد.';return;}
  const count=document.createElement('p');
  count.textContent=number.format(rows.length)+' پرونده · به ترتیب آخرین تغییر';
  const table=document.createElement('table');
  const head=table.createTHead().insertRow();
  for(const label of ['شماره پرونده','متقاضی','سازمان','نوع تسهیلات','وضعیت فعلی','مسئول اقدام / انجام‌دهنده','آخرین تغییر']){
   const th=document.createElement('th');th.scope='col';th.textContent=label;head.append(th);
  }
  const tbody=table.createTBody();
  for(const r of rows){
   const tr=tbody.insertRow(), at=lastUpdate(r);
   for(const value of [r.id,r.person?.name,r.person?.place?.split('/')[0].trim(),r.type,titles[r.state],caseActor(r),at?date.format(at):null])tr.insertCell().textContent=value||'—';
  }
  const scroll=document.createElement('div');scroll.className='facility-report-table';scroll.tabIndex=0;scroll.setAttribute('aria-label','جدول پرونده‌ها');scroll.append(table);
  body.replaceChildren(count,scroll);
 }
 let run=0;
 dialog.addEventListener('close',()=>{run++;button.focus();});
 button.addEventListener('click',async()=>{
  if(dialog.open)return;
  const request=++run;
  body.textContent='در حال دریافت آخرین وضعیت پرونده‌ها…';
  dialog.showModal();
  try{
   const saved=await all();
   if(request!==run||!dialog.open)return;
   // Reuse the current cartable scope without changing the open form or dashboard.
   const previous=records;
   let rows;
   try{records=saved;rows=[...visible()];}finally{records=previous;}
   show(rows.sort((a,b)=>lastUpdate(b)-lastUpdate(a)));
  }catch(error){if(request===run&&dialog.open)body.textContent='خواندن گزارش ممکن نشد. ذخیره‌سازی مرورگر را بررسی و دوباره تلاش کنید.';}
 });
})();
