(() => {
 async function render(){
 const box=document.getElementById('erd-diagram'),diagram=box?.querySelector('.mermaid');if(!diagram)return;
 try{await document.fonts.ready;if(!diagram.querySelector('svg')&&!diagram.dataset.processed)await mermaid.run({nodes:[diagram]});
 const svg=diagram.querySelector('svg');if(!svg)throw Error('Missing SVG');
 const titles=window.housingErdTitles||{};
 const groups=[];
 groups.forEach((g,i)=>{const hue=Math.round(i*360/19);g.querySelectorAll('rect').forEach(r=>{r.style.fill=`hsl(${hue} 65% ${r.classList.contains('entityBox')?84:95}%)`;r.style.stroke=`hsl(${hue} 45% 38%)`});});
 svg.querySelectorAll('text').forEach(t=>{const key=t.textContent.trim();if(titles[key]){t.textContent=titles[key].split(' · ')[0];t.style.fontFamily='Vazir,Tahoma,sans-serif';t.style.fontWeight='700';}});
 box.style.cssText='height:75vh;min-height:460px;overflow:hidden;position:relative;background:#f8fafc;border:1px solid #ccd8e6;border-radius:16px;direction:ltr;touch-action:none;cursor:grab;padding:0';
 const stage=document.createElement('div');stage.style.cssText='position:absolute;left:0;top:0;transform-origin:0 0;user-select:none';box.append(stage);stage.append(diagram);diagram.style.minWidth='0';diagram.style.margin='0';
 const vb=svg.viewBox.baseVal,w=vb.width||svg.getBoundingClientRect().width,h=vb.height||svg.getBoundingClientRect().height;svg.style.maxWidth='none';svg.style.width=w+'px';svg.style.height=h+'px';
 let x=0,y=0,z=1,drag=null;const paint=()=>stage.style.transform=`translate(${x}px,${y}px) scale(${z})`;
 const fit=()=>{z=Math.min((box.clientWidth-32)/w,(box.clientHeight-32)/h);x=(box.clientWidth-w*z)/2;y=16;paint()};
 function zoom(f,cx=box.clientWidth/2,cy=box.clientHeight/2){const next=Math.max(.015,Math.min(5,z*f)),r=next/z;x=cx-(cx-x)*r;y=cy-(cy-y)*r;z=next;paint()}
 const tools=document.createElement('div');tools.dir='rtl';tools.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin:12px 0';
 [['بزرگ‌نمایی +',()=>zoom(1.25)],['کوچک‌نمایی −',()=>zoom(.8)],['نمایش کامل',fit],['اندازه واقعی',()=>{z=1;x=y=0;paint()}],['تمام‌صفحه',()=>box.requestFullscreen?.()]].forEach(([t,fn])=>{const b=document.createElement('button');b.type='button';b.className='btn';b.textContent=t;b.onclick=fn;tools.append(b)});box.before(tools);
 box.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,px:x,py:y};box.setPointerCapture(e.pointerId);box.style.cursor='grabbing';e.preventDefault()});
 box.addEventListener('pointermove',e=>{if(!drag)return;x=drag.px+e.clientX-drag.x;y=drag.py+e.clientY-drag.y;paint()});
 const stop=()=>{drag=null;box.style.cursor='grab'};box.addEventListener('pointerup',stop);box.addEventListener('pointercancel',stop);
 box.addEventListener('wheel',e=>{e.preventDefault();const r=box.getBoundingClientRect();zoom(e.deltaY<0?1.12:1/1.12,e.clientX-r.left,e.clientY-r.top)},{passive:false});
 box.tabIndex=0;box.setAttribute('aria-label','مدل روابط داده؛ پیمایش با کشیدن یا کلیدهای جهت و بزرگ‌نمایی با چرخ ماوس');box.addEventListener('keydown',e=>{const d={ArrowLeft:[60,0],ArrowRight:[-60,0],ArrowUp:[0,60],ArrowDown:[0,-60]}[e.key];if(d){e.preventDefault();x+=d[0];y+=d[1];paint()}else if(e.key==='+')zoom(1.25);else if(e.key==='-')zoom(.8);else if(e.key==='Home')fit()});new ResizeObserver(()=>{if(!drag)fit()}).observe(box);fit();
 }catch(e){console.error('ERD rendering failed:',e);const p=document.createElement('p');p.setAttribute('role','alert');p.textContent='نمایش نمودار با خطا مواجه شد؛ منبع ERD برای دانلود در دسترس است.';box.before(p)}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();
})();
