(() => {
  const section = document.getElementById('analysis-bpmn');
  const canvas = document.getElementById('bpmn-canvas');
  let viewer;
  let loading = false;
  let portrait = false;
  const themes = [
    ['navy', 'سورمه‌ای', '#0d1b2a'], ['blue', 'آبی', '#1e40af'],
    ['orange', 'نارنجی', '#9a3412'], ['purple', 'بنفش', '#6b21a8'],
    ['green', 'سبز', '#166534'], ['teal', 'فیروزه‌ای', '#115e59'],
    ['rose', 'زرشکی', '#9f1239'], ['slate', 'خاکستری', '#334155']
  ];
  let selectedTheme = 'blue';
  try { selectedTheme = localStorage.getItem('housing-bpmn-theme-v166') || 'blue'; } catch (_) {}
  if (!themes.some(t => t[0] === selectedTheme)) selectedTheme = 'blue';
  function applyTheme() {
    const color = themes.find(t => t[0] === selectedTheme)[2];
    if (viewer) {
      const registry = viewer.get('elementRegistry');
      registry.getAll().filter(e => e.type === 'bpmn:UserTask').forEach(e => {
        const rect = registry.getGraphics(e).querySelector('.djs-visual > rect');
        if (rect) rect.style.setProperty('fill', color, 'important');
      });
    }
    themePanel.querySelectorAll('button').forEach(b => {
      const active = b.dataset.theme === selectedTheme;
      b.setAttribute('aria-pressed', String(active));
      b.style.outline = active ? '3px solid #94a3b8' : 'none';
      b.style.outlineOffset = '2px';
    });
  }
  const themePanel = document.createElement('div');
  themePanel.className = 'bpmn-theme-panel';
  themePanel.setAttribute('role', 'group');
  themePanel.setAttribute('aria-label', 'تم رنگ پس‌زمینه تسک‌ها');
  themePanel.style.cssText = 'display:flex;align-items:center;flex-wrap:wrap;gap:8px;padding:9px 12px;margin:10px 0;border:1px solid #cbd5e1;border-radius:9px;background:#f8fafc;direction:rtl;font-size:12px';
  const themeTitle = document.createElement('strong');
  themeTitle.textContent = 'تم';
  themePanel.appendChild(themeTitle);
  themes.forEach(([id, name, color]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = name;
    button.dataset.theme = id;
    button.style.cssText = `background:${color};color:#fff;border:1px solid transparent;border-radius:6px;padding:5px 10px;font:inherit;line-height:1.5;cursor:pointer`;
    button.onclick = () => {
      selectedTheme = id;
      try { localStorage.setItem('housing-bpmn-theme-v166', id); } catch (_) {}
      applyTheme();
    };
    themePanel.appendChild(button);
  });
  canvas.parentElement.insertBefore(themePanel, document.getElementById('bpmn-status'));
  applyTheme();
  const laneThemes = [
    ['blue', 'آبی', '#eff6ff'], ['navy', 'سورمه‌ای', '#e2e8f0'],
    ['orange', 'نارنجی', '#fff7ed'], ['purple', 'بنفش', '#f5f3ff'],
    ['green', 'سبز', '#f0fdf4'], ['teal', 'فیروزه‌ای', '#f0fdfa'],
    ['rose', 'صورتی', '#fff1f2'], ['white', 'سفید', '#ffffff']
  ];
  let selectedLaneTheme = 'blue';
  try { selectedLaneTheme = localStorage.getItem('housing-bpmn-lane-theme') || 'blue'; } catch (_) {}
  if (!laneThemes.some(t => t[0] === selectedLaneTheme)) selectedLaneTheme = 'blue';
  const lanePanel = document.createElement('div');
  lanePanel.style.cssText = themePanel.style.cssText;
  lanePanel.setAttribute('role', 'group');
  lanePanel.setAttribute('aria-label', 'تم رنگ Laneها');
  const laneTitle = document.createElement('strong');
  laneTitle.textContent = 'تم Laneها';
  lanePanel.appendChild(laneTitle);
  themeTitle.textContent = 'تم تسک‌ها';
  function applyLaneTheme() {
    const color = laneThemes.find(t => t[0] === selectedLaneTheme)[2];
    if (viewer) {
      const registry = viewer.get('elementRegistry');
      registry.getAll().filter(e => e.type === 'bpmn:Lane' || e.type === 'bpmn:Participant').forEach(e => {
        const rect = registry.getGraphics(e).querySelector('.djs-visual > rect');
        if (rect) { rect.style.setProperty('fill', color, 'important'); rect.style.setProperty('fill-opacity', '1', 'important'); }
      });
    }
    lanePanel.querySelectorAll('button').forEach(b => {
      const active = b.dataset.theme === selectedLaneTheme;
      b.setAttribute('aria-pressed', String(active));
      b.style.outline = active ? '3px solid #94a3b8' : 'none';
      b.style.outlineOffset = '2px';
    });
  }
  laneThemes.forEach(([id, name, color]) => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = name; button.dataset.theme = id;
    button.style.cssText = `background:${themes.find(t => t[0] === id)?.[2] || '#64748b'};color:#fff;border:1px solid transparent;border-radius:6px;padding:5px 10px;font:inherit;line-height:1.5;cursor:pointer`;
    button.onclick = () => {
      selectedLaneTheme = id;
      try { localStorage.setItem('housing-bpmn-lane-theme', id); } catch (_) {}
      applyLaneTheme();
    };
    lanePanel.appendChild(button);
  });
  themePanel.after(lanePanel);
  applyLaneTheme();
  function layoutXML() {
    const source = document.getElementById('bpmn-source').textContent;
    if (!portrait) return source;
    const doc = new DOMParser().parseFromString(source, 'application/xml');
    doc.querySelectorAll('BPMNShape').forEach(shape => {
      const b = Array.from(shape.children).find(e => e.localName === 'Bounds');
      if (!b) return;
      const x = +b.getAttribute('x'), y = +b.getAttribute('y'), w = +b.getAttribute('width'), h = +b.getAttribute('height');
      const lane = shape.getAttribute('bpmnElement').startsWith('Lane_');
      b.setAttribute('x', lane ? y : y + h / 2 - w / 2);
      b.setAttribute('y', lane ? x : x + w / 2 - h / 2);
      if (lane) { b.setAttribute('width', h); b.setAttribute('height', w); shape.setAttribute('isHorizontal', 'false'); }
    });
    doc.querySelectorAll('waypoint').forEach(p => {
      const x = p.getAttribute('x'); p.setAttribute('x', p.getAttribute('y')); p.setAttribute('y', x);
    });
    doc.querySelectorAll('BPMNEdge').forEach(edge => {
      const flow = doc.getElementById(edge.getAttribute('bpmnElement')) || Array.from(doc.querySelectorAll('sequenceFlow')).find(f => f.id === edge.getAttribute('bpmnElement'));
      if (!flow) return;
      const points = Array.from(edge.children).filter(e => e.localName === 'waypoint');
      for (const [ref, index, next] of [['sourceRef', 0, 1], ['targetRef', points.length - 1, points.length - 2]]) {
        const shape = Array.from(doc.querySelectorAll('BPMNShape')).find(s => s.getAttribute('bpmnElement') === flow.getAttribute(ref));
        const b = shape && Array.from(shape.children).find(e => e.localName === 'Bounds');
        const point = points[index], neighbor = points[next];
        if (!b || !point || !neighbor) continue;
        const cx = +b.getAttribute('x') + +b.getAttribute('width') / 2, cy = +b.getAttribute('y') + +b.getAttribute('height') / 2;
        if (Math.abs(+point.getAttribute('x') - +neighbor.getAttribute('x')) < 0.1) {
          point.setAttribute('x', cx); point.setAttribute('y', cy + Math.sign(+neighbor.getAttribute('y') - cy) * +b.getAttribute('height') / 2);
        } else {
          point.setAttribute('y', cy); point.setAttribute('x', cx + Math.sign(+neighbor.getAttribute('x') - cx) * +b.getAttribute('width') / 2);
        }
      }
    });
    doc.querySelectorAll('BPMNLabel Bounds').forEach(b => {
      const x = +b.getAttribute('x'), y = +b.getAttribute('y'), w = +b.getAttribute('width'), h = +b.getAttribute('height');
      b.setAttribute('x', y + h / 2 - w / 2); b.setAttribute('y', x + w / 2 - h / 2);
    });
    doc.querySelectorAll('endEvent, startEvent').forEach(event => {
      const shape = Array.from(doc.querySelectorAll('BPMNShape')).find(s => s.getAttribute('bpmnElement') === event.id);
      const b = shape && Array.from(shape.children).find(e => e.localName === 'Bounds');
      const label = shape && shape.querySelector('BPMNLabel Bounds');
      if (b && label) { label.setAttribute('x', +b.getAttribute('x') + +b.getAttribute('width') / 2 - +label.getAttribute('width') / 2); label.setAttribute('y', +b.getAttribute('y') + +b.getAttribute('height') + 12); }
    });
    return new XMLSerializer().serializeToString(doc);
  }
  async function render() {
    if (!section.open || !canvas.getClientRects().length || loading) return;
    loading = true;
    try {
      if (!viewer) {
        await document.fonts.load('14px Vazir');
        viewer = new BpmnJS({ container: canvas, textRenderer: { defaultStyle: { fontFamily: 'Vazir', fontSize: 14.742 }, externalStyle: { fontFamily: 'Vazir', fontSize: 13.608 } } });
        await viewer.importXML(layoutXML());
        // Render task titles as isolated RTL HTML: SVG bidi anchoring can
        // displace Persian tspans outside their task in an RTL document.
        const registry = viewer.get('elementRegistry');
        const xml = new DOMParser().parseFromString(layoutXML(), 'application/xml');
        const labelBounds = new Map();
        xml.querySelectorAll('BPMNEdge, BPMNShape').forEach(di => {
          const label = Array.from(di.children).find(child => child.localName === 'BPMNLabel');
          const bounds = label && Array.from(label.children).find(child => child.localName === 'Bounds');
          if (bounds) labelBounds.set(di.getAttribute('bpmnElement'), Object.fromEntries(['x', 'y', 'width', 'height'].map(k => [k, Number(bounds.getAttribute(k))])));
        });
        const lanePalette = ['#93c5fd', '#5eead4', '#c4b5fd', '#fcd34d', '#a5b4fc', '#86efac', '#f9a8d4'];
        let taskColorIndex = 0;
        const laneColors = new Map();
        xml.querySelectorAll('lane').forEach((lane, index) => {
          Array.from(lane.children).filter(child => child.localName === 'flowNodeRef').forEach(ref => laneColors.set(ref.textContent.trim(), lanePalette[index % lanePalette.length]));
        });
        const laneNames = new Map();
        xml.querySelectorAll('lane').forEach(lane => {
          Array.from(lane.children).filter(child => child.localName === 'flowNodeRef').forEach(ref => laneNames.set(ref.textContent.trim(), lane.getAttribute('name')));
        });
        registry.getAll().forEach(element => {
          const isTask = element.type === 'bpmn:UserTask';
          const isLabel = element.type === 'label';
          if (element.type === 'bpmn:Participant') {
            // The pool's built-in header separator crosses the lane titles.
            registry.getGraphics(element).querySelectorAll('.djs-visual > path, .djs-visual > polyline').forEach(line => line.remove());
          }
          if (element.type === 'bpmn:Lane') {
            // Use an explicitly centred HTML title, avoiding SVG RTL anchoring
            // that pushes Persian text onto the lane's separator line.
            const visual = registry.getGraphics(element).querySelector('.djs-visual');
            visual.querySelectorAll('text').forEach(text => text.remove());
            const ns = 'http://www.w3.org/2000/svg';
            const separator = document.createElementNS(ns, 'path');
            separator.setAttribute('d', `M 30 0 L 30 ${element.height}`);
            separator.setAttribute('stroke', '#334d70');
            separator.setAttribute('stroke-width', '1.5');
            separator.setAttribute('fill', 'none');
            visual.appendChild(separator);
            const group = document.createElementNS(ns, 'g');
            const horizontal = element.di ? element.di.isHorizontal !== false : true;
            const length = horizontal ? element.height : element.width;
            group.setAttribute('transform', horizontal
              ? `translate(15,${element.height / 2}) rotate(-90)`
              : `translate(${element.width / 2},15)`);
            const foreign = document.createElementNS(ns, 'foreignObject');
            foreign.setAttribute('x', String(-length / 2));
            foreign.setAttribute('y', '-15');
            foreign.setAttribute('width', String(length));
            foreign.setAttribute('height', '30');
            foreign.style.pointerEvents = 'none';
            const title = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
            title.setAttribute('dir', 'rtl');
            title.className = 'bpmn-lane-title';
            title.textContent = element.businessObject.name || '';
            title.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;box-sizing:border-box;white-space:nowrap;font-family:Vazir,sans-serif;font-size:19px;font-weight:700;line-height:1;color:#0d1b2a;text-align:center;';
            foreign.appendChild(title);
            group.appendChild(foreign);
            visual.appendChild(group);
          }
          if (element.type === 'bpmn:StartEvent') {
            const circle = registry.getGraphics(element).querySelector('.djs-visual > circle');
            if (circle) {
              circle.style.setProperty('fill', '#16a34a', 'important');
              circle.style.setProperty('stroke', '#166534', 'important');
            }
          }
          if (element.type === 'bpmn:EndEvent') {
            const circle = registry.getGraphics(element).querySelector('.djs-visual > circle');
            if (circle) {
              circle.style.setProperty('fill', '#dc2626', 'important');
              circle.style.setProperty('stroke', '#991b1b', 'important');
            }
          }
          if (!isTask && !isLabel) return;
          const graphics = registry.getGraphics(element);
          if (isTask) {
            const laneName = laneNames.get(element.id) || 'نامشخص';
            const tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            tooltip.textContent = `Lane مسئول: ${laneName}`;
            graphics.prepend(tooltip);
            graphics.setAttribute('aria-label', `${element.businessObject.name} — Lane مسئول: ${laneName}`);
            const rect = graphics.querySelector('.djs-visual > rect');
            if (rect) {
              rect.style.setProperty('fill', '#0D1B2A', 'important');
              rect.style.setProperty('stroke', '#ffffff', 'important');
              rect.style.strokeWidth = '2px';
              rect.setAttribute('rx', '14');
              rect.setAttribute('ry', '14');
            }
          }
          if (isLabel) {
            const bounds = labelBounds.get(element.businessObject.id);
            if (bounds) {
              Object.assign(element, bounds);
              graphics.setAttribute('transform', `translate(${bounds.x},${bounds.y})`);
            } else {
              element.width = Math.max(element.width, 160);
              element.height = Math.max(element.height, 50);
            }
          }
          const visual = graphics.querySelector('.djs-visual');
          visual.querySelectorAll('text').forEach(text => text.remove());
          const foreign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
          const inset = isTask ? 8 : 0;
          foreign.setAttribute('x', String(inset));
          foreign.setAttribute('y', String(inset));
          foreign.setAttribute('width', String(element.width - inset * 2));
          foreign.setAttribute('height', String(element.height - inset * 2));
          foreign.style.pointerEvents = 'none';
          const title = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
          title.setAttribute('class', 'bpmn-task-title');
          title.setAttribute('dir', 'rtl');
          title.textContent = element.businessObject.name || '';
          title.style.fontFamily = 'Vazir, sans-serif';
          if (isTask) { title.style.color = '#ffffff'; title.style.fontWeight = '700'; }
          title.style.fontSize = '13.608px';
          if (isLabel) { title.style.background = 'transparent'; title.style.lineHeight = '1.6'; }
          if (isLabel && element.businessObject.$type === 'bpmn:SequenceFlow') {
            title.classList.add('bpmn-flow-condition');
            title.style.background = 'transparent';
            title.style.color = '#b45309';
            title.style.fontWeight = '700';
            title.style.border = 'none';
            title.style.borderRadius = '0';
            title.style.padding = '0 3px';
            title.style.alignItems = 'flex-end';
            title.dataset.flowId = element.businessObject.id;
          }
          if (isLabel && ['BP03', 'Ex1', 'Ex2', 'Flow_9', 'ExecutiveReturnForCorrection'].includes(element.businessObject.id)) {
            title.style.alignItems = 'center';
            title.style.whiteSpace = 'nowrap';
          }
          if (isLabel && ['ResubmitCorrection', 'Flow_17'].includes(element.businessObject.id)) {
            title.style.whiteSpace = 'nowrap';
            title.style.flexWrap = 'nowrap';
          }
          foreign.appendChild(title);
          visual.appendChild(foreign);
        });
      }
      applyTheme();
      applyLaneTheme();
      viewer.get('canvas').resized();
      viewer.get('canvas').zoom('fit-viewport', 'auto');
      document.getElementById('bpmn-status').textContent = 'برای جابه‌جایی نمودار بکشید؛ برای بزرگ‌نمایی از دکمه‌ها استفاده کنید.';
    } catch (error) {
      document.getElementById('bpmn-status').textContent = 'نمایش نمودار ناموفق بود؛ فایل BPMN همچنان قابل دانلود است.';
      console.error(error);
      if (viewer) viewer.destroy();
      viewer = null;
    } finally { loading = false; }
  }
  document.getElementById('bpmn-fullscreen').onclick = async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await canvas.parentElement.requestFullscreen();
    requestAnimationFrame(render);
  };
  document.addEventListener('fullscreenchange', () => requestAnimationFrame(render));
  section.addEventListener('toggle', () => requestAnimationFrame(render));
  document.querySelectorAll('.landing-tab-list button').forEach(b => b.addEventListener('click', () => requestAnimationFrame(render)));
  document.getElementById('bpmn-fit').onclick = () => render();
  for (const [id, factor] of [['bpmn-in', 1.3], ['bpmn-out', 1 / 1.3]]) {
    document.getElementById(id).onclick = () => {
      if (viewer) { const c = viewer.get('canvas'); c.zoom(c.zoom() * factor); }
    };
  }
  // The standalone page is already open: its initial toggle may fire before
  // this script is loaded. Render explicitly instead of waiting for a toggle.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(render), { once: true });
  } else {
    requestAnimationFrame(render);
  }
  window.addEventListener('resize', () => requestAnimationFrame(render));
})();
