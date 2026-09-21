const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.match(/\.(tsx|ts|js|prisma)$/)) {
        results.push(file);
      }
    }
  });
  return results;
}
const dirs = ['src', 'scripts', 'prisma'];
let files = [];
dirs.forEach(d => {
  files = files.concat(walk(path.join(process.cwd(), d)));
});
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let newContent = content;
  newContent = newContent.replace(/'TERBIT'/g, "'TERBIT'");
  newContent = newContent.replace(/"TERBIT"/g, '"TERBIT"');
  newContent = newContent.replace(/'MENUNGGU'/g, "'MENUNGGU'");
  newContent = newContent.replace(/"MENUNGGU"/g, '"MENUNGGU"');
  if (content !== newContent) {
    fs.writeFileSync(f, newContent, 'utf8');
    console.log('Updated', f);
  }
});
