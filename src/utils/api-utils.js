import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

export function validFilePath(file) {
  const filePath = path.join(__dirname, 'src/controllers/' + file + '.js');

  return fs.existsSync(filePath);
}
