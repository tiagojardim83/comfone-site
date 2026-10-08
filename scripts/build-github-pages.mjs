import {cpSync,mkdirSync,readdirSync,readFileSync,rmSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const base=process.argv[2]??'/comfone-site';
if(!/^\/[a-zA-Z0-9_-]+$/.test(base))throw new Error('Expected a single repository path such as /comfone-site');
rmSync('_site',{recursive:true,force:true});mkdirSync('_site');cpSync('dist','_site',{recursive:true});
function walk(dir){for(const item of readdirSync(dir,{withFileTypes:true})){const file=join(dir,item.name);if(item.isDirectory())walk(file);else if(item.name.endsWith('.html')){const html=readFileSync(file,'utf8').replace(/\b(href|src)="\/(?!\/)([^"]*)"/g,(_,attr,value)=>`${attr}="${base}/${value}"`);writeFileSync(file,html);}}}
walk('_site');writeFileSync('_site/.nojekyll','');
console.log(`GitHub Pages output ready in _site with base ${base}/`);
