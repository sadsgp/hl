'use strict';
function decisionTimeline(r){
 const entries=[];
 const add=(at,role,text,name)=>{if(!text)return;entries.push({at:at||0,role,text,name:name||((r.history||[]).find(x=>x.actor===role&&x.actorName)?.actorName)||Object.values(roleInfo).find(x=>x[0]===role)?.[1]||'نام ثبت‌کننده ثبت نشده است'});};
 const admin=roleInfo.admin[0],hr=roleInfo.hr[0],executive=roleInfo.executive[0];
 if(r.initialApplicantAt)add(r.initialApplicantAt,'متقاضی','تأیید اطلاعات اولیه با کد نمایشی',r.person?.name);
 for(const x of r.exceptionActions||[])add(x.at,x.by,({forward:'ارجاع استثنایی به مقام اجرایی',refer:'ارجاع استثنایی به مدیر سرمایه انسانی',continue:'مجوز ادامه بررسی استثنایی',close:'بستن درخواست استثنایی'}[x.action]||x.action)+'\nنظر: '+x.opinion,x.name);
 if(r.exceptionWorkgroupOpinion)add(r.exceptionWorkgroupAt,hr,'نظر کارگروه درباره درخواست غیرمشمول:\n'+r.exceptionWorkgroupOpinion);
 if(r.exceptionDecision && !(r.exceptionActions||[]).some(x=>['continue','close'].includes(x.action)&&x.opinion===r.exceptionDecision))add(r.exceptionApproval?.at||r.exceptionClosedAt||r.exceptionWorkgroupAt,hr,'تصمیم مدیر سرمایه انسانی درباره استثنا:\n'+r.exceptionDecision);
 if(r.applicantAt)add(r.applicantAt,'متقاضی','تأیید اطلاعات و مدارک با کد نمایشی',r.person?.name);
 if(r.withdrawAt)add(r.withdrawAt,'متقاضی','انصراف صریح از درخواست\n'+(r.withdrawReason||'بدون توضیح'),r.person?.name);
 if(r.executiveAt)add(r.executiveAt,executive,(r.executiveApproved===false||r.state==='executive_rejected'?'عدم تأیید درخواست':'تأیید درخواست')+'\nنظر: '+(r.executiveReason||'بدون توضیح تکمیلی'),r.executiveBy);
 if(r.workgroupReviewed)add(r.hrInitialOpinionAt,hr,'نظر کارگروه: '+r.workgroupOpinion);
 if(r.hrInitialOpinion)add(r.hrInitialOpinionAt,hr,(r.hrRejectedStage==='initial'?'رد درخواست در بررسی اولیه':'تأیید اولیه و ارجاع به تحقیقات')+'\nنظر: '+r.hrInitialOpinion+(r.creditAmount?'\nمبلغ مصوب: '+Number(r.creditAmount).toLocaleString('fa-IR')+' ریال':''));
 if(r.investigation)add(r.investigation.at,roleInfo.investigation[0],'نتیجه بررسی: '+r.investigation.result+'\nنظر: '+r.investigation.opinion,r.investigation.by);
 if(r.finalWorkgroupReviewed)add(r.finalWorkgroupAt,hr,'نظر کارگروه در مرحله تصمیم نهایی: '+r.finalWorkgroupOpinion);
 if(r.hrDecision&&r.hrRejectedStage!=='initial')add(r.hrDecisionAt,hr,(r.state==='hr_rejected'?'عدم تأیید درخواست':'تأیید و ارجاع به کارشناس اداری')+'\nنظر: '+r.hrDecision);
 for(const a of r.officerActivities||[])add(a.at,roleInfo.officer[0],'گزارش: '+a.title+'\n'+(a.description||'بدون شرح'),a.by);
 if(r.bankReport)add(r.bankReport.at,roleInfo.officer[0],'گزارش واریز: '+(r.bankReport.payment||'')+'\nهماهنگی با بانک: '+(r.bankReport.coordination||''),r.bankReport.by);
 for(const round of r.correctionRounds||[]){
 const snapshot=round.snapshot||{};
 if(snapshot.executiveAt&&snapshot.executiveAt!==r.executiveAt)add(snapshot.executiveAt,executive,(snapshot.executiveApproved===false?'عدم تأیید درخواست':'تأیید درخواست')+'\nنظر: '+(snapshot.executiveReason||'بدون توضیح تکمیلی'),snapshot.executiveBy);
 add(round.at,roleInfo[round.role]?.[0]||round.role,'بازگشت برای اصلاح\nدلیل: '+round.reason,round.by);
 if(round.resubmittedAt)add(round.resubmittedAt,admin,'ثبت اصلاحات و ارسال مجدد به مقام اجرایی\nشرح اصلاحات: '+(round.response||''));
 }
 for(const note of r.evidenceAdminNotes||[])add(note.at,admin,'توضیحات سرپرست اداری درباره اسناد مثبته:\n'+note.text,note.by);
 for(const [i,round] of (r.evidenceRounds||[]).entries()){
  add(round.submittedAt,admin,'ارسال اسناد مثبته به مدیر سرمایه انسانی — نوبت '+(i+1).toLocaleString('fa-IR')+(round.adminDescription?'\nتوضیحات: '+round.adminDescription:''),round.submittedBy);
  if(round.reviewedAt)add(round.reviewedAt,hr,(round.result==='finish'?'تأیید اسناد مثبته و پایان و اتمام درخواست':'بازگشت اسناد مثبته به سرپرست اداری برای اصلاح')+'\nنظر / دلیل: '+(round.note||'بدون توضیح تکمیلی'),round.reviewedBy);
 }
 if(r.completedAt&&!(r.evidenceRounds||[]).some(x=>x.result==='finish'))add(r.completedAt,hr,'پایان و اتمام درخواست\n'+(r.evidenceReviewNote||''));
 for(const x of r.history||[])if(/مشاهده.*گزارش|گزارش.*مشاهده|ثبت سند مثبته|حذف سند مثبته/.test(x.text))add(x.at,x.actor,x.text,x.actorName);
 const seen=new Set();for(let i=entries.length-1;i>=0;i--){const key=JSON.stringify([entries[i].at,entries[i].role,entries[i].text]);if(seen.has(key))entries.splice(i,1);else seen.add(key);}
 entries.sort((a,b)=>a.at-b.at);
 return entries.length?'<ol class="decision-timeline">'+entries.map(x=>'<li class="note" style="margin-block:12px;border-inline-start:4px solid #2563eb"><b style="color:#1d4ed8">'+esc(x.role)+'</b><div>نام و نام خانوادگی: <strong style="color:#9d174d">'+esc(x.name)+'</strong></div><small>'+(x.at?fa(x.at):'زمان ثبت موجود نیست')+'</small><div style="white-space:pre-wrap;margin-top:8px">'+esc(x.text)+'</div></li>').join('')+'</ol>':'<p class="muted">هنوز نظر یا تصمیمی ثبت نشده است.</p>';
}
