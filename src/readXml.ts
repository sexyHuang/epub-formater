import * as fs from 'fs/promises';
import * as xml2js from 'xml2js';
import * as path from 'path';
import * as compressing from 'compressing';

const reader = async () => {
  const parser = new xml2js.Parser();
  const builder = new xml2js.Builder();
  const xmlData = await fs.readFile(
    path.join(__dirname, './../output/test/OPS/fb.opf')
  );
  const res = await parser.parseStringPromise(xmlData);
  res.package.manifest[0].item.push({
    $: {
      href: 'images/test.jpg',
      id: 'test',
      'media-type': 'image/jpeg'
    }
  });
  await fs.writeFile(
    path.join(__dirname, './../output/test/OPS/fb.opf'),
    builder.buildObject(res)
  );

  await compressing.zip.compressDir(
    path.join(__dirname, './../output/test/'),
    path.join(__dirname, './../output/test.epub'),
    { ignoreBase: true }
  );
  console.log(res);
};

reader();
