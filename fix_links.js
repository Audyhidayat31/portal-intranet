const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            filelist = walkSync(filepath, filelist);
        } else if (filepath.endsWith('.tsx') || filepath.endsWith('.ts')) {
            filelist.push(filepath);
        }
    }
    return filelist;
};

const files = walkSync(path.join(__dirname, 'src', 'app'));

let count = 0;
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;

    content = content.replace(/<Link[^>]*href=\"\/antar-pegawai\"[^>]*>([\s\S]*?)<\/Link>/g, '<span>$1</span>');
    content = content.replace(/<Link[^>]*href=\"\/kabar-kedinasan\"[^>]*>([\s\S]*?)<\/Link>/g, '<span>$1</span>');
    content = content.replace(/<Link[^>]*href=\"\/admin\/dashboard\"[^>]*>([\s\S]*?)<\/Link>/g, '<span>$1</span>');

    if (content !== originalContent) {
        fs.writeFileSync(file, content);
        count++;
        console.log('Updated ' + file);
    }
}
console.log('Total files updated: ' + count);
