import * as compressing from 'compressing';
import * as path from 'path';
import { exit } from 'process';

compressing.zip
  .uncompress(
    path.join(__dirname, './../input/test.epub'),
    path.join(__dirname, './../output/test')
  )
  .then(() => {
    console.log('done');
    exit();
  });
