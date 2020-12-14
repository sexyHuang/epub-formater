import * as path from 'path';
import * as fs from 'fs';
import { inputDir, outputDir } from '../const';
import { exit } from 'process';
import formateITM from '../libs/formateITM';

const main = async () => {
  const inputDirent = await fs.promises.opendir(inputDir);
  for await (const dirent of inputDirent) {
    console.log(`${dirent.name}格式化开始...`);
    const { title = '', author = '' } =
      dirent.name.match(/\[(?<author>.*)\]\.(?<title>.*)\.epub/)?.groups ?? {};
    if (!title) continue;

    await formateITM(
      path.join(inputDir, dirent.name),
      path.join(outputDir, dirent.name),
      {
        title,
        author
      }
    );
    console.log(`${dirent.name}格式化成功！`);
  }
  console.log('任务完成。');
};

main().then(() => {
  exit();
});
