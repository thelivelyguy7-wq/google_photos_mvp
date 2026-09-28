const fs = require('fs');
const path = require('path');
const https = require('https');

const categories = [
  { folder: "Hiking in the monsoon near Maharashtra mountains", tags: "hiking,monsoon", count: 2 },
  { folder: "The houseboat trip we took in Kerala with family", tags: "houseboat,kerala", count: 3 },
  { folder: "That hidden waterfall we found in the jungle", tags: "waterfall,jungle", count: 3 },
  { folder: "Watching the sunset from a hammock", tags: "hammock,sunset", count: 3 }
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      }
      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', reject);
  });
};

async function main() {
  const baseDir = path.join(__dirname, 'public', 'google');
  for (const cat of categories) {
    const dir = path.join(baseDir, cat.folder);
    for (let i = 0; i < cat.count; i++) {
      const url = `https://loremflickr.com/800/600/${cat.tags}?random=${Math.random()}`;
      const filename = `flickr_gen_${i}.jpg`;
      const filepath = path.join(dir, filename);
      console.log(`Downloading ${filename} for ${cat.folder}...`);
      try {
        await downloadImage(url, filepath);
      } catch(e) {
        console.error(e);
      }
    }
  }
  console.log("Done downloading 11 images.");
}
main();
