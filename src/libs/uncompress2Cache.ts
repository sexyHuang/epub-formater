import path = require('path');
import * as compressing from 'compressing';
import { ROOT } from './../const';

const CACHE_PATH = path.join(ROOT, '_cache/');
let id = 0;
const getCacheKey = () => `__cache_${id++}`;
const uncompress2Cache = async (target: string) => {
  const cacheDir = path.join(CACHE_PATH, getCacheKey());
  await compressing.zip.uncompress(target, cacheDir);
  return cacheDir;
};

export default uncompress2Cache;
