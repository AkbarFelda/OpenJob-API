const fs = require('fs');
const https = require('https');
const zlib = require('zlib');

const mmd = fs.readFileSync('erd.mmd', 'utf8');

// kroki uses deflate + base64 encoding for the payload
const deflated = zlib.deflateSync(mmd);
const encoded = deflated.toString('base64').replace(/\+/g, '-').replace(/\//g, '_');

const url = `https://kroki.io/mermaid/png/${encoded}`;

https.get(url, (res) => {
  if (res.statusCode === 200) {
    const file = fs.createWriteStream('ERD-OpenJob-versi-1.png');
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('ERD-OpenJob-versi-1.png created successfully!');
    });
  } else {
    console.error(`Failed to generate image: ${res.statusCode}`);
  }
}).on('error', (err) => {
  console.error('Error:', err.message);
});
