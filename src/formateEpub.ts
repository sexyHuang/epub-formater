import * as path from 'path';
import * as compressing from 'compressing';

const CACHE_PATH = path.join(__dirname, '../_cache/');
let id = 0;
const getCacheKey = () => `__cache_${id++}`;

const formateEpub = async (target: string, outputPath: string) => {
  // 解压目标ebup
  const cache_dir = path.join(CACHE_PATH, getCacheKey());
  compressing.zip.uncompress(target, cache_dir);

  // to do: 读取META-INF/container.xml
  // to do: 从container读取rootfile路径
  // to do: 读取图片文件夹
  // to do: 把所有图片配置到rootfile的manifest下
  // to do: 输出新的ebup文件
};

export default formateEpub;
