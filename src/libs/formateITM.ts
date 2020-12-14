import uncompress2Cache from './uncompress2Cache';
// import * as fs from 'fs';
import * as compressing from 'compressing';
import rewirteiTunesMetadata from './rewirteiTunesMetadata';
const formateITM = async (
  target: string,
  outputPath: string,
  options: {
    title: string;
    author: string;
  }
) => {
  // 解压目标ebup
  const cacheDir = await uncompress2Cache(target);

  await rewirteiTunesMetadata(cacheDir, options);

  // 输出新的ebup文件
  await compressing.zip.compressDir(cacheDir, outputPath, { ignoreBase: true });

  // await fs.promises.rm(cacheDir, { recursive: true, force: true });
};

export default formateITM;
