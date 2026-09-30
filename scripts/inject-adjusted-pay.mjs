#!/usr/bin/env node
import fs from 'node:fs';

const TAG = '<script src="adjusted-pay.js"></script>';
const files = ['public/index.html', 'public/edit.html'];

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.warn(`  adjusted-pay: ${file} not found; skipped`);
    continue;
  }
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes(TAG)) {
    console.log(`  adjusted-pay: ${file} already wired`);
    continue;
  }
  const pos = html.toLowerCase().lastIndexOf('</body>');
  if (pos < 0) throw new Error(`${file} has no </body> tag`);
  html = html.slice(0, pos) + TAG + '\n' + html.slice(pos);
  fs.writeFileSync(file, html);
  console.log(`  adjusted-pay: wired ${file}`);
}
