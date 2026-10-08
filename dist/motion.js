(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const sections = [...document.querySelectorAll('main > section')];
  const counters = [...document.querySelectorAll('.stats strong, .number-band strong')].map(el => {
    const original = el.textContent.trim();
    const match = original.match(/^([\d,]+)(.*)$/);
    if (!match) return null;
    const value = Number(match[1].replaceAll(',', ''));
    const display = document.createElement('span');
    display.className = 'counter-display'; display.setAttribute('aria-hidden', 'true');
    while (el.firstChild) display.append(el.firstChild);
    const label = document.createElement('span'); label.className = 'sr-only'; label.textContent = original;
    el.append(display, label);
    const node = [...display.childNodes].find(n => n.nodeType === Node.TEXT_NODE && /\d/.test(n.nodeValue));
    if (!node) return null;
    const counter = { el, node, value, suffix: match[2], frame: 0, centered: false, grouped: match[1].includes(',') };
    el.addEventListener('pointerenter', e => { if (e.pointerType !== 'touch') animate(counter); });
    return counter;
  }).filter(Boolean);
  const paused = () => preference.matches || document.documentElement.classList.contains('paused');
  const format = (counter, value) => counter.grouped ? value.toLocaleString('en-US') : String(value);
  function finish(counter) {
    cancelAnimationFrame(counter.frame); counter.frame = 0;
    counter.node.nodeValue = format(counter, counter.value) + (counter.node.parentNode.childNodes.length === 1 ? counter.suffix : '');
  }
  function animate(counter) {
    if (paused()) { finish(counter); return; }
    cancelAnimationFrame(counter.frame);
    let start;
    function tick(time) {
      start ??= time;
      const progress = Math.min((time - start) / 1100, 1);
      const number = Math.round(counter.value * (1 - Math.pow(1 - progress, 3)));
      counter.node.nodeValue = format(counter, number) + (counter.node.parentNode.childNodes.length === 1 ? counter.suffix : '');
      if (progress < 1 && !paused()) counter.frame = requestAnimationFrame(tick);
      else finish(counter);
    }
    counter.frame = requestAnimationFrame(tick);
  }
  let queued = false;
  function update() {
    queued = false;
    const disabled = paused();
    document.body.classList.toggle('motion-enabled', !disabled);
    const viewport = innerHeight;
    const top = document.querySelector('.header')?.getBoundingClientRect().bottom ?? 0;
    const center = (viewport + top) / 2;
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const focused = section.contains(document.activeElement);
      const edge = Math.min(150, Math.max(70, rect.height * .25));
      const visibility = disabled || focused ? 1 : Math.max(0, Math.min(1, (viewport - rect.top) / edge, (rect.bottom - top) / edge));
      section.style.setProperty('--section-opacity', visibility.toFixed(3));
    });
    counters.forEach(counter => {
      const rect = counter.el.getBoundingClientRect();
      const isCentered = rect.top <= center + 45 && rect.bottom >= center - 45;
      if (isCentered && !counter.centered) animate(counter);
      counter.centered = isCentered;
      if (disabled) finish(counter);
    });
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  addEventListener('scroll', schedule, { passive: true }); addEventListener('resize', schedule);
  document.addEventListener('focusin', schedule); document.addEventListener('focusout', schedule);
  preference.addEventListener('change', schedule);
  new MutationObserver(schedule).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  new ResizeObserver(schedule).observe(document.querySelector('main'));
  update();
})();
