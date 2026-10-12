import fs from 'fs';
import path from 'path';

const FOOTER_FILE_PATH = path.join(process.cwd(), 'src', 'lib', 'footer-config.json');

export function getFooterConfig() {
  try {
    if (fs.existsSync(FOOTER_FILE_PATH)) {
      const data = fs.readFileSync(FOOTER_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading footer config file:', err);
  }
  return null;
}
