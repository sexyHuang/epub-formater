import * as xml2js from 'xml2js';
import * as fs from 'fs';
import * as path from 'path';
import { CONTAINER } from '../const';

const parser = new xml2js.Parser();
const getRootfileObject = async (targetDir: string) => {
  // 读取META-INF/container.xml
  const containerPath = path.join(targetDir, CONTAINER);
  const containerXMLObject = await parser.parseStringPromise(
    await fs.promises.readFile(containerPath)
  );

  // 从container读取rootfile路径
  const rootfilePath = path.join(
    targetDir,
    containerXMLObject.container.rootfiles[0].rootfile[0].$['full-path']
  ) as string;
  const xml = await parser.parseStringPromise(
    await fs.promises.readFile(rootfilePath)
  );
  return {
    path: rootfilePath,
    xml
  };
};

export default getRootfileObject;
