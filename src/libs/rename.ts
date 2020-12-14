import getRootfileObject from './getRootfileObject';
import uncompress2Cache from './uncompress2Cache';
import * as fs from 'fs';
import * as xml2js from 'xml2js';
import * as compressing from 'compressing';
import * as path from 'path';

const builder = new xml2js.Builder();
const parser = new xml2js.Parser();

const rename = async (
  target: string,
  outputPath: string,
  { title, author }: { title: string; author: string }
) => {
  // 解压目标ebup
  const cacheDir = await uncompress2Cache(target);

  const {
    path: rootfilePath,
    xml: rootfileXMLObject
  } = await getRootfileObject(cacheDir);

  const nxcPath = path.join(
    path.dirname(rootfilePath),
    rootfileXMLObject.package.manifest[0].item.find(val => val.$.id === 'ncx').$
      .href
  );

  const nxcXMLObject = await parser.parseStringPromise(
    await fs.promises.readFile(nxcPath)
  );

  rootfileXMLObject.package.metadata[0]['dc:title'] = [title];
  rootfileXMLObject.package.metadata[0]['dc:creator'] = [author];
  nxcXMLObject.ncx.docTitle = [{ text: [title] }];
  nxcXMLObject.ncx.docAuthor = [{ text: [author] }];

  await Promise.all([
    fs.promises.writeFile(rootfilePath, builder.buildObject(rootfileXMLObject)),
    fs.promises.writeFile(nxcPath, builder.buildObject(nxcXMLObject))
  ]);

  // 输出新的ebup文件
  await compressing.zip.compressDir(cacheDir, outputPath, { ignoreBase: true });

  await fs.promises.rm(cacheDir, { recursive: true, force: true });
};

export default rename;
