const header = document.querySelector('.full-nav');
const triggers = [...header.querySelectorAll('.nav-trigger')];
const nav = header.querySelector('nav');
const menu = header.querySelector('.menu-toggle');
const hoverDesktop = matchMedia('(min-width: 1101px) and (hover: hover) and (pointer: fine)');
let closeTimer;
function openGroup(trigger) {
  clearTimeout(closeTimer); closeGroups(trigger);
  trigger.setAttribute('aria-expanded', 'true');
  document.getElementById(trigger.getAttribute('aria-controls')).hidden = false;
}
triggers.forEach(trigger => {
  const group = trigger.closest('.nav-group');
  group.addEventListener('pointerenter', () => { if (hoverDesktop.matches) openGroup(trigger); });
  group.addEventListener('pointerleave', () => {
    if (hoverDesktop.matches) closeTimer = setTimeout(() => {
      if (!group.matches(':hover') && !group.contains(document.activeElement)) closeGroups();
    }, 180);
  });
  trigger.addEventListener('focus', () => { if (hoverDesktop.matches) openGroup(trigger); });
});
nav.querySelectorAll(':scope > a').forEach(a => a.addEventListener('pointerenter', () => { if (hoverDesktop.matches) closeGroups(); }));
function closeGroups(except) {
  triggers.forEach(t => { if (t !== except) { t.setAttribute('aria-expanded', 'false'); document.getElementById(t.getAttribute('aria-controls')).hidden = true; } });
}
function closeNavigation() { clearTimeout(closeTimer); closeGroups(); nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label','Open navigation'); }
triggers.forEach(t => t.addEventListener('click', () => {
  if (hoverDesktop.matches && t.matches(':hover')) { openGroup(t); return; }
  const open = t.getAttribute('aria-expanded') !== 'true';
  closeGroups(t); t.setAttribute('aria-expanded', String(open)); document.getElementById(t.getAttribute('aria-controls')).hidden = !open;
}));
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; closeGroups(); nav.classList.toggle('open', open); menu.setAttribute('aria-expanded',String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click',closeNavigation));
document.addEventListener('click', e => { if(!header.contains(e.target)) closeNavigation(); });
document.addEventListener('keydown', e => { if(e.key==='Escape') { const active = triggers.find(t=>t.getAttribute('aria-expanded')==='true'); const mobile = menu.getAttribute('aria-expanded')==='true'; closeNavigation(); if(active)active.focus(); else if(mobile)menu.focus(); } });
header.addEventListener('focusout', e => { if(e.relatedTarget && !header.contains(e.relatedTarget))closeGroups(); });
nav.querySelectorAll('a').forEach(a=>{if(a.getAttribute('href')===location.pathname){a.setAttribute('aria-current','page');const trigger=a.closest('.nav-group')?.querySelector('.nav-trigger');if(trigger)trigger.classList.add('current');}});
window.matchMedia('(min-width: 1101px)').addEventListener('change',closeNavigation);
