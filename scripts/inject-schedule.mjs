import fs from 'node:fs';
const path='public/index.html';
let html=fs.readFileSync(path,'utf8');
const removeTags=[
  '<script src="schedule.js"></script>',
  '<script src="schedule-menu.js"></script>',
  '<script src="program-chainage.js"></script>'
];
const tags=[
  '<script src="schedule.js"></script>',
  '<script src="program-chainage.js"></script>'
];
for(const tag of removeTags) html=html.split(tag).join('');
const pos=html.lastIndexOf('</body>');
if(pos<0) throw new Error('public/index.html has no </body> tag');
const block=tags.join('\n')+'\n';
html=html.slice(0,pos)+block+html.slice(pos);
fs.writeFileSync(path,html);
const tail=html.slice(-500);
for(const tag of tags){
  if(!tail.includes(tag)) throw new Error(tag+' was not wired at the real end of body');
}
if(tail.includes('<script src="schedule-menu.js"></script>')) throw new Error('old schedule dropdown is still wired');
console.log('Wired schedule.js and program-chainage.js before the final </body> tag');
