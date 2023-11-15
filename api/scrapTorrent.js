const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
const headers = require("./headers");
const toEnglish = require("./rus2eng");

const scrapTorrent = async (torrent, ruTracker) => {
  const $torrent = cheerio.load(torrent);
  const filename = $torrent("a").eq(1).text().trim();
  const id = $torrent("a").eq(1).attr("href");
  const topic_id = `${ruTracker}/forum/${id}`;

  const topic_response = await axios.get(topic_id, {
    ...headers("text/html"),
    responseType: "arraybuffer",
  });

  const topic_data = iconv.decode(
    Buffer.from(topic_response.data),
    "windows-1251"
  );
  const $topic_page = cheerio.load(topic_data);

  if ($topic_page(".mrg_16").length) {
    return null;
  }

  const filesize = $topic_page("#t-tor-stats tr .borderless b")
    .eq(0)
    .text()
    .trim();
  const seeders = $topic_page("#t-tor-stats tr .seed b").text().trim();
  const leechers = $topic_page("#t-tor-stats tr .leech b").text().trim();
  const total_snatches = $topic_page("#t-tor-stats tr .borderless b")
    .eq(2)
    .text()
    .trim();
  const snatches = total_snatches.match(/([\d,]+)/);
  const magnet = $topic_page(".magnet-link").attr("href");
  const info_hash = $topic_page(".magnet-link").attr("title");
  const uploaded_date = $topic_page(".attach tbody tr")
    .eq(1)
    .find(".inlined li")
    .eq(0)
    .text()
    .trim();
  const dlId = $topic_page(".dl-stub.dl-link.dl-topic").attr("href");
  const torrentDlId = `${ruTracker}/forum/${dlId}`;

  return {
    filename,
    filesize,
    seeders: parseInt(seeders),
    leechers: leechers.length === 0 ? 0 : parseInt(leechers),
    snatches: snatches ? parseInt(snatches[1].replace(/,/g, ""), 10) : 0,
    magnet,
    infohash: info_hash,
    date: toEnglish(uploaded_date),
    topic: topic_id,
    download_id: torrentDlId,
  };
};

module.exports = scrapTorrent;
