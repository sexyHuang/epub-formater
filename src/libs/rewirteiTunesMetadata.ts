import * as fs from 'fs';
import * as path from 'path';

import * as cheerio from 'cheerio';
import * as crypto from 'crypto';
import uuid from './uuid';
import getRootfileObject from './getRootfileObject';

enum Key {
  artistName = 'artistName',
  itemName = 'itemName',
  playlistName = 'playlistName',
  releaseDate = 'releaseDate'
}
const now = new Date();
const formatedDate = `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(
  2,
  '0'
)}-${`${now.getDate()}`.padStart(2, '0')}`;
const createFileMD5 = (filePath: string) => {
  const stream = fs.createReadStream(filePath);
  const fsHash = crypto.createHash('md5');
  stream.on('data', d => {
    fsHash.update(d);
  });
  return new Promise<string>((resolve, reject) => {
    stream.on('end', () => {
      const md5 = fsHash.digest('hex');
      resolve(md5);
    });
    stream.on('error', reject);
  });
};

const creatNewiTunesMetadata = async (
  targetDir: string,
  {
    author,

    title
  }: {
    title: string;
    author: string;
  }
) => {
  const rootfilePath = (await getRootfileObject(targetDir)).path;
  const $ = cheerio.load(await fs.promises.readFile(rootfilePath, 'utf-8'));
  const coverPath = $(`[id="${$('meta[name="cover"]').attr('content')}"]`).attr(
    'href'
  )!;
  const rootfileMD5 = await createFileMD5(rootfilePath);
  const coverMD5 = await createFileMD5(
    path.join(path.dirname(rootfilePath), coverPath)
  );
  return `<?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
  <plist version="1.0">
  <dict>
    <key>artistName</key>
    <string>${author}</string>
    <key>book-info</key>
    <dict>
      <key>cover-image-hash</key>
      <string>${coverMD5}</string>
      <key>cover-image-path</key>
      <string>${coverPath}</string>
      <key>package-file-hash</key>
      <string>${rootfileMD5}</string>
      <key>unique-id</key>
      <integer>${uuid(19, 10)}</integer>
    </dict>
    <key>genre</key>
    <string>轻小说</string>
    <key>itemName</key>
    <string>${title}</string>
    <key>playlistName</key>
    <string>${title}</string>
    <key>releaseDate</key>
    <string>${formatedDate}</string>
  </dict>
  </plist>`;
};

const setDistValue = (dist: cheerio.Cheerio, key: Key, value: string) => {
  dist.find(`key:contains(${key})`).next().text(value);
};

const rewirteiTunesMetadata = async (
  targetDir: string,
  { title, author }: { title: string; author: string }
) => {
  const filePath = path.join(targetDir, 'iTunesMetadata.plist');
  if (!fs.existsSync(filePath))
    return fs.promises.writeFile(
      filePath,
      await creatNewiTunesMetadata(targetDir, { author, title })
    );

  const xmlStr = await fs.promises.readFile(
    path.join(targetDir, 'iTunesMetadata.plist'),
    'utf-8'
  );
  const $ = cheerio.load(xmlStr, {
    xmlMode: true
  });
  const dist = $('dict');

  setDistValue(dist, Key.artistName, author);
  setDistValue(dist, Key.itemName, title);
  setDistValue(dist, Key.playlistName, title);
  setDistValue(dist, Key.releaseDate, formatedDate);

  return fs.promises.writeFile(filePath, $.xml());
};

export default rewirteiTunesMetadata;
