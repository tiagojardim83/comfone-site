const services = [...document.querySelectorAll('.service')];
services.forEach(service => service.addEventListener('toggle', () => {
  if (service.open) services.forEach(other => { if (other !== service) other.open = false; });
}));
const layers = {
  connect: ['A foundation for global reach.', 'IPX and hubbing bring networks together. Build your international connectivity on shared infrastructure.'],
  manage: ['Clarity in every connection.', 'Data and financial clearing bring roaming operations into focus. Manage records and settlements through one ecosystem.'],
  grow: ['See the opportunity in your data.', 'Data management, M2M monetisation and integrated partner solutions help you explore the next stage of your business.']
};
const tabs = [...document.querySelectorAll('[role="tab"]')];
const panel = document.getElementById('platform-panel');
function selectTab(tab) {
  tabs.forEach(t => { const active = t === tab; t.setAttribute('aria-selected', String(active)); t.tabIndex = active ? 0 : -1; });
  const key = tab.dataset.layer;
  panel.setAttribute('aria-labelledby', tab.id);
  panel.querySelector('h3').textContent = layers[key][0]; panel.querySelector('p').textContent = layers[key][1];
  document.querySelectorAll('.layer').forEach(l => l.classList.toggle('active', l.classList.contains('layer-' + key)));
}
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', e => {
    let next;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % tabs.length;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i + tabs.length - 1) % tabs.length;
    if (e.key === 'Home') next = 0; if (e.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { e.preventDefault(); selectTab(tabs[next]); tabs[next].focus(); }
  });
});
const pause = document.querySelector('.motion-toggle');
pause.addEventListener('click', () => {
  const paused = document.documentElement.classList.toggle('paused');
  pause.textContent = paused ? '▷' : 'Ⅱ'; pause.setAttribute('aria-label', paused ? 'Resume animations' : 'Pause animations'); pause.title = paused ? 'Resume animations' : 'Pause animations';
});
let ticking = false;
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  document.querySelector('.reading-progress').style.width = (max > 0 ? window.scrollY / max * 100 : 0) + '%';
  ticking = false;
}
window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; } }, { passive: true });
window.addEventListener('resize', updateProgress); updateProgress();
