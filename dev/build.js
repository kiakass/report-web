const fs = require('fs-extra');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend');
const destDir = path.join(__dirname, '..', 'prod', 'frontend');

fs.copy(srcDir, destDir, { overwrite: true }, (err) => {
  if (err) {
    console.error('빌드 실패:', err);
    process.exit(1);
  } else {
    console.log('빌드 성공: dev/frontend → prod/frontend 복사 완료');
  }
});
