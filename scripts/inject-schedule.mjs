import fs from 'node:fs';
const path='public/index.html';
let html=fs.readFileSync(path,'utf8');
const tag='<script src="schedule.js"></script>';
if(!html.includes(tag)){
  if(!html.includes('</body>')) throw new Error('public/index.html has no </body> tag');
  html=html.replace('</body>',tag+'\n</body>');
  fs.writeFileSync(path,html);
  console.log('Injected schedule.js into public/index.html');
}else{
  console.log('schedule.js already injected');
}
