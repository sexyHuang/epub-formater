import * as fs from 'fs';
import { CACHE_PATH } from 'src/libs/uncompress2Cache';

fs.promises
  .rm(CACHE_PATH, { force: true, recursive: true })
  .then(() => console.log('done'));
