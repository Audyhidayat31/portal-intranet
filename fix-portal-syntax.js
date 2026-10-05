const fs = require('fs');
const path = 'src/app/(portal)/profil/akun/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace the opening part
content = content.replace(
  "{isEditModalOpen && typeof document !== 'undefined' && createPortal(",
  "{isEditModalOpen && typeof document !== 'undefined' ? createPortal("
);

// Replace the closing part
content = content.replace(
  "      ), document.body)}",
  "      ), document.body) : null}"
);

fs.writeFileSync(path, content);
console.log('Fixed JSX syntax error');
