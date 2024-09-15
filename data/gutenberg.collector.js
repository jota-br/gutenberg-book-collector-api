const https = require('https');
const csv = require('csv-parser');

const { upsertBook } = require('../src/models/books.model')

const url = 'https://www.gutenberg.org/cache/epub/feeds/pg_catalog.csv';

async function gutenbergParser(req, res) {
  res.status(200).json({ msg: 'Collector started...' });
  https.get(url, async (res) => {
    let dataCount = 0;
    res
      .pipe(csv())
      .on("data", async (data) => {
        await upsertBook(data);
        dataCount++;
      })
      .on("end", async () => {
        return dataCount;
      })
      .on("error", async (err) => {
        return err;
      });
  });
}

module.exports = {
  gutenbergParser,
}