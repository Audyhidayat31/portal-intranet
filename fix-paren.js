const fs = require('fs');
const path = 'src/app/(portal)/profil/akun/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// The line is `      ), document.body) : null}`
// It should be `      , document.body) : null}`

content = content.replace("      ), document.body) : null}", "      , document.body) : null}");

fs.writeFileSync(path, content);
console.log('Fixed parenthesis syntax error');
