//import * as fs from 'fs';
import uncompress2Cache from './uncompress2Cache';
import * as xml2js from 'xml2js';
import * as fs from 'fs';
import * as path from 'path';
import * as compressing from 'compressing';
import getRootfileObject from './getRootfileObject';

const builder = new xml2js.Builder();

// to do: 自动检测文件夹中图片获取路径
const IMAGE_PATH = 'OPS/images';

const formateEpub = async (target: string, outputPath: string) => {
  // 解压目标ebup
  const cacheDir = await uncompress2Cache(target);

  // 读取rootfile
  const {
    path: rootfilePath,
    xml: rootfileXMLObject
  } = await getRootfileObject(cacheDir);
  const manifestItemList = rootfileXMLObject.package.manifest[0].item;

  // 读取图片文件夹
  const imagePath = path.join(cacheDir, IMAGE_PATH);
  const imageDir = await fs.promises.opendir(imagePath);
  // 把所有图片配置到rootfile的manifest下
  for await (const dirent of imageDir) {
    const relativeDirname = path.relative(
      path.dirname(rootfilePath),
      imagePath
    );
    manifestItemList.push({
      $: {
        href: `${relativeDirname}/${dirent.name}`,
        id: dirent.name,
        'media-type': 'image/jpeg'
      }
    });
  }

  await fs.promises.writeFile(
    rootfilePath,
    builder.buildObject(rootfileXMLObject)
  );

  // 输出新的ebup文件
  await compressing.zip.compressDir(cacheDir, outputPath, { ignoreBase: true });

  await fs.promises.rm(cacheDir, { recursive: true, force: true });
};

export default formateEpub;
