import formateEpub from './formateEpub';
import * as path from 'path';
import * as fs from 'fs';
import { ROOT } from './const';
import { exit } from 'process';

const inputDir = path.join(ROOT, 'input');
const outputDir = path.join(ROOT, 'output');

const main = async () => {
  const inputDirent = await fs.promises.opendir(inputDir);
  for await (const dirent of inputDirent) {
    console.log(`${dirent.name}格式化开始...`);
    await formateEpub(
      path.join(inputDir, dirent.name),
      path.join(outputDir, dirent.name)
    );
    console.log(`${dirent.name}格式化成功！`);
  }
  console.log('任务完成。');
};

main().then(() => {
  exit();
});
