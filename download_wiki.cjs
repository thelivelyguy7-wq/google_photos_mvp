const https = require('https');
const fs = require('fs');
const path = require('path');

const categories = [
  { folder: "Hiking in the monsoon near Maharashtra mountains", queries: ["Hiking", "Monsoon"], count: 2 },
  { folder: "The houseboat trip we took in Kerala with family", queries: ["Houseboat", "Kerala", "Backwater"], count: 3 },
  { folder: "That hidden waterfall we found in the jungle", queries: ["Waterfall", "Jungle", "Rainforest"], count: 3 },
  { folder: "Watching the sunset from a hammock", queries: ["Hammock", "Sunset", "Beach"], count: 3 }
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
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
      const q = cat.queries[i % cat.queries.length];
      const filename = `flickr_gen_${i}.jpg`;
      const filepath = path.join(dir, filename);
      const url = `https://picsum.photos/seed/${q}/800/600`;
      
      console.log(`Downloading fallback for ${q} to ${filename}...`);
      await downloadImage(url, filepath);
    }
  }
  console.log("Done.");
}
main();
