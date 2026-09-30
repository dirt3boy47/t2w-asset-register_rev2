import fs from 'node:fs';
const path='public/index.html';
let html=fs.readFileSync(path,'utf8');
const tags=[
  '<script src="schedule.js"></script>',
  '<script src="schedule-menu.js"></script>'
];
for(const tag of tags) html=html.split(tag).join('');
const pos=html.lastIndexOf('</body>');
if(pos<0) throw new Error('public/index.html has no </body> tag');
const block=tags.join('\n')+'\n';
html=html.slice(0,pos)+block+html.slice(pos);
fs.writeFileSync(path,html);
const tail=html.slice(-500);
for(const tag of tags){
  if(!tail.includes(tag)) throw new Error(tag+' was not wired at the real end of body');
}
console.log('Wired schedule.js and schedule-menu.js before the final </body> tag');