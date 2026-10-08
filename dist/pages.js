let selected='all';
const filters=[...document.querySelectorAll('.filter-button')];
const items=[...document.querySelectorAll('.filter-item')];
const search=document.getElementById('article-search');
function filterItems(){let count=0;const query=search?.value.trim().toLowerCase()??'';items.forEach(item=>{const match=(selected==='all'||item.dataset.category===selected)&&(!query||item.dataset.search?.includes(query));item.hidden=!match;if(match){count++;item.classList.add('visible');}});const counter=document.querySelector('.result-count');if(counter)counter.textContent=count+' article'+(count===1?'':'s');const empty=document.querySelector('.empty-results');if(empty)empty.hidden=count>0;}
filters.forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.filter;filters.forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});filterItems();}));
search?.addEventListener('input',filterItems);
let scheduled=false;
function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.reading-progress').style.width=(max>0?scrollY/max*100:0)+'%';scheduled=false;}
window.addEventListener('scroll',()=>{if(!scheduled){requestAnimationFrame(updateProgress);scheduled=true;}},{passive:true});window.addEventListener('resize',updateProgress);updateProgress();
