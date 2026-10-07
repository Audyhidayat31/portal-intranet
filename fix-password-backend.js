const fs = require('fs');
const file = 'src/app/api/profile/me/route.ts';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  /if \(newPassword\) \{/,
  `if (newPassword) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).+$/;
      if (!passwordRegex.test(newPassword)) {
        return NextResponse.json({ success: false, message: 'Sandi baru harus mengandung huruf besar, huruf kecil, angka, dan setidaknya 1 simbol.' }, { status: 400 });
      }`
);

fs.writeFileSync(file, c, 'utf8');
console.log('Backend validation added');
