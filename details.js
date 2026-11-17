'use strict';
function persianDigits(value){return String(value).replace(/[0-9٠-٩]/g,c=>'۰۱۲۳۴۵۶۷۸۹'[/[0-9]/.test(c)?Number(c):'٠١٢٣٤٥٦٧٨٩'.indexOf(c)]);}
document.addEventListener('DOMContentLoaded',()=>{
 const localize=()=>document.querySelectorAll('input:not([type=file]):not([type=checkbox]):not([type=radio]),textarea').forEach(el=>{
  if(el.type==='number'){el.type='text';el.inputMode='decimal';}
  const value=persianDigits(el.value);if(el.value!==value)el.value=value;
  if(el.id==='detail-requestedAmount'||(el.id.startsWith('detail-')&&financialFields.some(f=>'detail-'+f.key===el.id)))formatMoneyInput(el);
 });
 document.addEventListener('input',event=>{const el=event.target;if(!el.matches('input:not([type=file]):not([type=checkbox]):not([type=radio]),textarea'))return;const start=el.selectionStart,end=el.selectionEnd;el.value=persianDigits(el.value);if(start!==null)el.setSelectionRange(start,end);},true);
 localize();new MutationObserver(localize).observe(document.body,{childList:true,subtree:true});
});
// All personnel data below are fictitious Behko response fixtures, not real personnel records.
const behkoFixtures={
 '10428':{nationalId:'0000000001',mobile:'09120000001',hireDate:'۱۳۹۸/۰۵/۱۵',maritalStatus:'متأهل',children:2},
 '10852':{nationalId:'0000000002',mobile:'09120000002',hireDate:'۱۴۰۲/۰۱/۱۰',maritalStatus:'مجرد',children:0},
 '10113':{nationalId:'0000000003',mobile:'09120000003',hireDate:'۱۳۹۶/۰۷/۰۱',maritalStatus:'متأهل',children:1},
 '10991':{nationalId:'0000000004',mobile:'09120000004',hireDate:'۱۳۹۹/۰۸/۰۱',maritalStatus:'متأهل',children:0},
 '20421':{nationalId:'0000000005',mobile:'09120000005',hireDate:'۱۴۰۰/۰۸/۰۱',maritalStatus:'متأهل',children:3},
 '30015':{nationalId:'0000000006',mobile:'09120000006',hireDate:'۱۳۹۷/۰۶/۰۱',maritalStatus:'مجرد',children:0}
};
const housingFields=[
 {key:'registryOwnership',label:'وضعیت مالکیت شخص/همسر در مسکن (استعلام سامانه ثبت من)',options:['استفاده شده است','استفاده نشده است','سایر']},
 {key:'residenceType',label:'نوع سکونت فعلی',options:['استیجاری با پرداخت اجاره','سکونت بدون پرداخت اجاره','سایر']},
 {key:'currentLocation',label:'محل اقامت فعلی',placeholder:'شهر، منطقه و نشانی محل اقامت فعلی'},
 {key:'residenceDuration',label:'مدت اقامت در محل فعلی',placeholder:'مثلاً ۲ سال و ۶ ماه'},
 {key:'familyOwnership',label:'مالکیت اعضای خانواده در محل سکونت',options:['بله','خیر']},
 {key:'previousGroupHousing',label:'آیا تاکنون از تسهیلات یا طرح‌های خرید و ساخت مسکن گروه استفاده کرده‌اید؟',options:['بله','خیر']}
];
const financialFields=[
 {key:'averageMonthlySalary',label:'میانگین دریافت حقوق ماهیانه'},
 {key:'otherIncome',label:'میزان سایر درآمدها'},
 {key:'maximumDownPayment',label:'حداکثر میزان توان تأمین آورده اولیه'},
 {key:'currentInstallments',label:'مجموع اقساط در حال پرداخت (ماهیانه)'},
 {key:'housingRepaymentCapacity',label:'میزان توان بازپرداخت احتمالی ماهیانه جهت اقساط مسکن'}
];
const assessmentFields=[
 {key:'adminPaymentAssessment',label:'ارزیابی توان تامین اولیه و پرداخت اقساط متقاضی'},
 {key:'averageMonthlyPerformance',label:'میانگین ارزیابی عملکرد ماهانه'},
 {key:'remarks',label:'ملاحظات'}
];
function profileAndDetails(r){
 const p=r.person?{...behkoFixtures[r.person.id],...r.person}:{};
 const personal=[['نام و نام خانوادگی',p.name],['کد ملی',p.nationalId],['کد پرسنلی',p.id],['شماره همراه',p.mobile],['عنوان شغلی',p.job],['محل خدمت',p.place],['تاریخ استخدام',p.hireDate],['وضعیت تأهل',p.maritalStatus],['تعداد فرزند',p.children===undefined?undefined:Number(p.children).toLocaleString('fa-IR')]];
 const editable=ROLE==='admin'&&['draft','unknown','awaiting_admin_correction'].includes(r.state);
 const d=r.applicationDetails||{};
 let html='<h3>مبلغ درخواست تسهیلات</h3><div class="grid"><div><label for="detail-requestedAmount">مبلغ درخواست (ریال)'+(editable?' <span class="required-star" style="color:#dc2626">*</span>':'')+'</label><input '+(editable?'id="detail-requestedAmount" inputmode="numeric" maxlength="19" oninput="updateApplicationDetail(\'requestedAmount\',this)" onblur="formatMoneyInput(this)"':'readonly')+' value="'+esc(d.requestedAmount!==undefined&&d.requestedAmount!==''?persianDigits(Number(d.requestedAmount).toLocaleString('en-US')):(editable?'':'ثبت نشده'))+'" placeholder="حداکثر ۱۰٬۰۰۰٬۰۰۰٬۰۰۰ ریال"><small>بیش از صفر و حداکثر ده میلیارد ریال (معادل یک میلیارد تومان)؛ واحد این فیلد ریال است.</small></div></div><div class="sp"></div><h3>مشخصات فردی متقاضی · واکشی از بهکو</h3><div class="note">مشخصات از بهکو(در این پروتوتایپ نمایشی) دریافت می‌شود و قابل ویرایش نیست؛ اطلاعات ساختگی است.</div><div class="sp"></div><div class="grid three">'+personal.map(([label,value])=>'<div><label>'+label+'</label><input readonly value="'+esc(value??'—')+'"></div>').join('')+'</div><div class="sp"></div><h3>اطلاعات مربوط به وضعیت مسکن متقاضی</h3><div class="grid">';
 for(const field of housingFields){const value=d[field.key]??'';html+='<div><label for="detail-'+field.key+'">'+field.label+(editable?' <span class="required-star" style="color:#dc2626">*</span>':'')+'</label>';
 if(!editable)html+='<input readonly value="'+esc(value||'ثبت نشده')+'">';
 else if(field.options)html+='<select id="detail-'+field.key+'" onchange="updateApplicationDetail(\''+field.key+'\',this)"><option value="">انتخاب کنید</option>'+field.options.map(o=>'<option '+(o===value?'selected':'')+'>'+esc(o)+'</option>').join('')+'</select>';
 else html+='<input id="detail-'+field.key+'" maxlength="500" value="'+esc(value)+'" placeholder="'+esc(field.placeholder)+'" oninput="updateApplicationDetail(\''+field.key+'\',this)">';
 if(field.key==='registryOwnership')html+='<div id="registryOwnershipExplanation">'+registryExplanation(r,editable)+'</div>';
 if(field.key==='familyOwnership')html+='<div id="familyOwnershipWarning">'+familyOwnershipWarning(r,editable)+'</div>';
 if(field.key==='previousGroupHousing')html+='<div id="previousHousingWarning">'+previousHousingWarning(r,editable)+'</div>';
 html+='</div>'}
 html+='</div><div class="sp"></div><h3>اطلاعات مالی و توان بازپرداخت اقساط تسهیلات</h3><div class="note">مبالغ به <b>تومان</b> است؛ درآمد یا قسطِ نداشته را صفر وارد کنید. اطلاعات اظهاری است، نه استعلام مالی.</div><div class="sp"></div><div class="grid">';
 for(const field of financialFields){const value=d[field.key]??'';html+='<div><label for="detail-'+field.key+'">'+field.label+' (تومان)'+(editable?' <span class="required-star" style="color:#dc2626">*</span>':'')+'</label><input '+(!editable?'readonly':'id="detail-'+field.key+'" inputmode="numeric" maxlength="19" oninput="updateApplicationDetail(\''+field.key+'\',this)" onblur="formatMoneyInput(this)"')+' value="'+esc(value!==''?persianDigits(Number(value).toLocaleString('en-US')):(editable?'':'ثبت نشده'))+'" placeholder="مثلاً ۲۵٬۰۰۰٬۰۰۰"></div>'}
 html+='</div><div class="sp"></div><h3>ارزیابی و ملاحظات سرپرست اداری</h3><div class="note">ارزیابی توان تامین اولیه و پرداخت اقساط متقاضی توسط سرپرست اداری وارد می‌شود. مقیاس نمره عملکرد را همراه با میانگین بنویسید (مثلاً ۸۵ از ۱۰۰).</div><div class="sp"></div><div class="grid">';
 for(const field of assessmentFields){const value=d[field.key]??'';html+='<div><label for="detail-'+field.key+'">'+field.label+(editable&&field.key!=='remarks'?' <span class="required-star" style="color:#dc2626">*</span>':'')+'</label>';if(field.key==='averageMonthlyPerformance'){html+='<input type="text" style="width:100%;max-width:100%;box-sizing:border-box" placeholder="مثلاً ۸۵ از ۱۰۰" '+(editable?'id="detail-'+field.key+'" maxlength="50" oninput="updateApplicationDetail(\''+field.key+'\',this)"':'readonly')+' value="'+esc(value||(editable?'':'ثبت نشده'))+'">';}else{html+='<textarea '+(editable?'id="detail-'+field.key+'" maxlength="2000" oninput="updateApplicationDetail(\''+field.key+'\',this)"':'readonly disabled')+'>'+esc(value||(editable?'':'ثبت نشده'))+'</textarea>';}html+='</div>'}
 html+='</div><div class="sp"></div>';
 if(editable)html+='<div class="note">پس از تکمیل همه اطلاعات، حتماً دکمه «اجرای استعلام‌ها» را بزنید. فیلدهای ستاره‌دار برای ارسال الزامی‌اند؛ پیش‌نویس ناقص ذخیره می‌شود. سابقه اظهاری، نتیجه استعلام را تغییر نمی‌دهد.</div><div class="sp"></div>';
 return ['draft','unknown','awaiting_admin_correction'].includes(r.state)?html:collapsibleRequestDetails(html);
}
function collapsibleRequestDetails(html){return html.split(/<h3>(.*?)<\/h3>/).slice(1).reduce((result,part,index,parts)=>index%2===0?result+'<details class="request-detail-panel case-history"><summary>'+part+'</summary><div class="case-history-content">'+parts[index+1]+'</div></details>':result,'');}
// Fictitious application fixtures for prototype autofill; not inquiry results.
function fillRequestFromApplicant(r){
 const index=Object.keys(behkoFixtures).indexOf(r.person.id);
 if(index<0)return;
 const salary=[35000000,28000000,42000000,32000000,38000000,45000000][index];
 r.applicationDetails={requestedAmount:String(4000000000+index*500000000),registryOwnership:'استفاده نشده است',residenceType:'استیجاری با پرداخت اجاره',currentLocation:(r.person.scope==='qeshm'?'قشم':r.person.scope==='hq'?'اصفهان':'تهران')+'، نشانی نمونهٔ متقاضی '+r.person.name,residenceDuration:(index+1)+' سال',familyOwnership:'خیر',previousGroupHousing:r.person.loan?'بله':'خیر',averageMonthlySalary:String(salary),otherIncome:String(index*1000000),maximumDownPayment:String(500000000+index*100000000),currentInstallments:String(index*2000000),housingRepaymentCapacity:String(Math.floor(salary*0.35)),adminPaymentAssessment:'ارزیابی نمونه: توان تأمین آورده اولیه و پرداخت اقساط نیازمند بازبینی سرپرست است.',averageMonthlyPerformance:String(80+index*2)+' از ۱۰۰',remarks:'اطلاعات ساختگی برای نمایش پروتوتایپ؛ پیش از ثبت، توسط سرپرست بازبینی شود.'};
 delete r.familyOwnershipDecision;delete r.previousHousingDecision;r.previousHousingConfirmed=false;
 r.checked=false;r.eligible=false;delete r.checkedAt;
}
function toggleRequestAutoFill(enabled){
 if(ROLE!=='admin'||!current||!['draft','unknown'].includes(current.state))return;
 if(enabled&&current.person&&Object.values(current.applicationDetails||{}).some(v=>v!==''&&v!=null)&&!confirm('اطلاعات فعلی درخواست با اطلاعات نمونهٔ متقاضی جایگزین شود؟')){renderForm();return;}
 current.autoFillRequest=enabled;
 if(enabled&&current.person){fillRequestFromApplicant(current);current.state='draft';}
 renderForm();
}
function normalizeMoney(value){return String(value).replace(/[۰-۹]/g,c=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(c)).replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c)).replace(/[,٬\s]/g,'')}
function updateApplicationDetail(key,input){
 if(ROLE!=='admin'||!['draft','unknown','awaiting_admin_correction'].includes(current.state))return;
 const known=[...housingFields,...financialFields,...assessmentFields,{key:'requestedAmount'},{key:'registryOwnershipExplanation'}].find(f=>f.key===key);if(!known)return;
 current.applicationDetails ||= {};
 const isMoney=key==='requestedAmount'||financialFields.some(f=>f.key===key);
 const value=isMoney?normalizeMoney(input.value):input.value;
 current.applicationDetails[key]=value;
 if(key==='registryOwnership'){
  if(value!=='سایر')delete current.applicationDetails.registryOwnershipExplanation;
  const container=document.getElementById('registryOwnershipExplanation');if(container)container.innerHTML=registryExplanation(current,true);
 }
 if(key==='familyOwnership'){
  delete current.familyOwnershipDecision;
  const warning=document.getElementById('familyOwnershipWarning');
  if(warning)warning.innerHTML=familyOwnershipWarning(current,true);
 }
 if(key==='previousGroupHousing'){
  current.previousHousingConfirmed=false;
  delete current.previousHousingDecision;
  const warning=document.getElementById('previousHousingWarning');
  if(warning)warning.innerHTML=previousHousingWarning(current,true);
 }
 if(isMoney){input.setCustomValidity(key==='requestedAmount'&&value!==''&&(!/^\d+$/.test(value)||Number(value)<=0||Number(value)>10000000000)?'مبلغ درخواست باید بیش از صفر و حداکثر ده میلیارد ریال (معادل یک میلیارد تومان) باشد.':value!==''&&(!/^\d+$/.test(value)||!Number.isSafeInteger(Number(value)))?'مبلغ را به‌صورت عدد صحیح غیرمنفی وارد کنید.':'');formatMoneyInput(input);}
}
function registryExplanation(r,editable){
 const d=r.applicationDetails||{};if(d.registryOwnership!=='سایر')return '';
 return '<label for="detail-registryOwnershipExplanation">توضیحات سایر'+(editable?' <span class="required-star" style="color:#dc2626">*</span>':'')+'</label><textarea '+(editable?'id="detail-registryOwnershipExplanation" maxlength="2000" oninput="updateApplicationDetail(\'registryOwnershipExplanation\',this)"':'readonly')+'>'+esc(d.registryOwnershipExplanation||'')+'</textarea>';
}
function compactDecisionRow(message,decision,editable,handler){
 const status=decision==='بله'?'ادامه تأیید شد':decision==='خیر'?'ارسال متوقف است':'پاسخ سرپرست الزامی است';
 return '<div class="compact-decision" title="'+esc(message+'؛ '+status)+'"><span class="compact-decision-text">'+esc(message)+'؛ ادامه؟</span>'+(editable?'<span class="compact-decision-buttons" role="group" aria-label="تأیید ادامه توسط سرپرست اداری">'+[true,false].map(yes=>{const label=yes?'بله':'خیر';return '<button type="button" class="btn mini '+(decision===label?'primary':'')+'" aria-pressed="'+(decision===label)+'" onclick="'+handler+'('+yes+')">'+label+'</button>'}).join('')+'</span>':'<span class="compact-decision-status">'+esc(decision||'بدون پاسخ')+'</span>')+'</div>';
}
function previousHousingWarning(r,editable){
 if(r.applicationDetails?.previousGroupHousing!=='بله')return '';
 const decision=r.previousHousingDecision || (r.previousHousingConfirmed?'بله':'');
 return compactDecisionRow('سابقه استفاده از تسهیلات مسکن دارد',decision,editable,'setPreviousHousingDecision');
}
async function setPreviousHousingDecision(accepted){
 const r=current;
 if(ROLE!=='admin'||!['draft','unknown','awaiting_admin_correction'].includes(r.state)||r.applicationDetails?.previousGroupHousing!=='بله')return;
 r.previousHousingDecision=accepted?'بله':'خیر';
 r.previousHousingConfirmed=accepted;
 log(r,'پاسخ سرپرست اداری به ادامه با وجود سابقه استفاده از تسهیلات مسکن: '+r.previousHousingDecision);
 const warning=document.getElementById('previousHousingWarning');
 if(warning)warning.innerHTML=previousHousingWarning(r,true);
 await commit(r,'پاسخ «'+r.previousHousingDecision+'» سرپرست اداری ذخیره شد.');
}
function familyOwnershipWarning(r,editable){
 if(r.applicationDetails?.familyOwnership!=='بله')return '';
 const decision=r.familyOwnershipDecision||'';
 return compactDecisionRow('اعضای خانواده در محل سکونت مالکیت دارند',decision,editable,'setFamilyOwnershipDecision');
}
async function setFamilyOwnershipDecision(accepted){
 const r=current;
 if(ROLE!=='admin'||!['draft','unknown','awaiting_admin_correction'].includes(r.state)||r.applicationDetails?.familyOwnership!=='بله')return;
 r.familyOwnershipDecision=accepted?'بله':'خیر';
 log(r,'پاسخ سرپرست اداری به ادامه با وجود مالکیت اعضای خانواده در محل سکونت: '+r.familyOwnershipDecision);
 const warning=document.getElementById('familyOwnershipWarning');
 if(warning)warning.innerHTML=familyOwnershipWarning(r,true);
 await commit(r,'پاسخ «'+r.familyOwnershipDecision+'» سرپرست اداری ذخیره شد.');
}
function confirmPreviousHousing(r){
 if(r.applicationDetails?.familyOwnership==='بله'&&r.familyOwnershipDecision!=='بله'){
  const warning=document.getElementById('familyOwnershipWarning');
  if(warning){warning.innerHTML=familyOwnershipWarning(r,true);warning.scrollIntoView({behavior:'smooth',block:'center'});}
  toast('برای ادامه، پاسخ «بله» سرپرست اداری به هشدار مالکیت اعضای خانواده لازم است.');return false;
 }
 if(r.applicationDetails?.previousGroupHousing!=='بله' || r.previousHousingConfirmed)return true;
 const warning=document.getElementById('previousHousingWarning');
 if(warning){warning.innerHTML=previousHousingWarning(r,true);warning.scrollIntoView({behavior:'smooth',block:'center'});}
 toast('برای ادامه، پاسخ «بله» سرپرست اداری به هشدار سابقه تسهیلات لازم است.');
 return false;
}
function formatMoneyInput(input){const raw=normalizeMoney(input.value);if(/^\d+$/.test(raw)&&Number.isSafeInteger(Number(raw))){const pos=input.selectionStart;const right=pos===null?0:normalizeMoney(input.value.slice(pos)).length;input.value=persianDigits(raw.replace(/^0+(?=\d)/,'').replace(/\B(?=(\d{3})+(?!\d))/g,','));if(document.activeElement===input&&pos!==null){let p=input.value.length,n=0;while(p>0&&n<right){p--;if(/[۰-۹]/.test(input.value[p]))n++;}input.setSelectionRange(p,p);}}}
function validateApplicationDetails(r){
 const d=r.applicationDetails||{};
 const amount=String(d.requestedAmount??'');
 if(!/^\d+$/.test(amount)||!Number.isSafeInteger(Number(amount))||Number(amount)<=0||Number(amount)>10000000000){toast('مبلغ درخواست باید عدد صحیح، بیش از صفر و حداکثر ۱۰٬۰۰۰٬۰۰۰٬۰۰۰ ریال باشد.');focusApplicationField('requestedAmount');return false}
 if(d.registryOwnership==='سایر'&&!String(d.registryOwnershipExplanation||'').trim()){toast('برای گزینه «سایر» در استعلام سامانه ثبت من، توضیحات وارد کنید.');focusApplicationField('registryOwnershipExplanation');return false}
 for(const f of housingFields){if(!String(d[f.key]??'').trim()||(f.options&&!f.options.includes(d[f.key]))){toast('لطفاً «'+f.label+'» را تکمیل کنید.');focusApplicationField(f.key);return false}}
 for(const f of financialFields){const v=String(d[f.key]??'');if(!/^\d+$/.test(v)||!Number.isSafeInteger(Number(v))){toast('برای «'+f.label+'» مبلغ صحیح و غیرمنفی به تومان وارد کنید.');focusApplicationField(f.key);return false}}
 for(const f of assessmentFields.filter(f=>f.key!=='remarks')){if(!String(d[f.key]??'').trim()){toast('لطفاً «'+f.label+'» را تکمیل کنید.');focusApplicationField(f.key);return false}}
 return true;
}
function focusApplicationField(key){const el=document.getElementById('detail-'+key);if(el){el.focus();el.scrollIntoView({behavior:'smooth',block:'center'})}}
