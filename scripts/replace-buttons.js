const fs = require('fs');
const path = require('path');
const dir = 'd:/Users/Lenovo/Documents/portal-intranet/src';

let count = 0;
function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      walk(filePath);
    } else if (filePath.endsWith('.tsx') && !filePath.includes('pengumuman\\\\page.tsx') && !filePath.includes('pengumuman/page.tsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      const lines = content.split('\n');
      let changed = false;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-medium text-[10px] sm:text-xs py-1.5 px-3.5 rounded-full transition-colors flex items-center gap-1 shadow-sm cursor-pointer"')
         || lines[i].includes('className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-medium text-[10px] sm:text-xs py-1.5 px-3.5 rounded-full transition-colors flex items-center gap-1 shadow-sm"')) {
            lines[i] = lines[i].replace(/className="[^"]*"/, 'className="bg-[#00113a] text-white hover:bg-[#2a4386] font-bold text-xs py-2 px-4 rounded-md transition-colors shadow-sm cursor-pointer"');
            changed = true;
        }
        if (lines[i].includes('<ArrowRight') && i > 0 && lines[i-1].includes('<span>Lihat</span>')) {
            lines[i] = ''; // remove ArrowRight
            changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
        console.log('Updated', filePath);
        count++;
      }
    }
  });
}
walk(dir);
console.log('Total files updated:', count);
