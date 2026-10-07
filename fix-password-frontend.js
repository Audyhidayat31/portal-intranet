const fs = require('fs');
const file = 'src/app/(portal)/profil/akun/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  /if \(newPassword && newPassword !== confirmPassword\) \{\s*setStatusMessage\(\{ type: 'error', text: 'Konfirmasi password baru tidak cocok.' \}\);\s*return;\s*\}/,
  `if (newPassword) {
      if (newPassword !== confirmPassword) {
        setStatusMessage({ type: 'error', text: 'Konfirmasi password baru tidak cocok.' });
        return;
      }
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).+$/;
      if (!passwordRegex.test(newPassword)) {
        setStatusMessage({ type: 'error', text: 'Sandi baru harus mengandung huruf besar, huruf kecil, angka, dan setidaknya 1 simbol.' });
        return;
      }
    }`
);

fs.writeFileSync(file, c, 'utf8');
console.log('Frontend validation added');
