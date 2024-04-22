const { RUTRACKER: ruTracker } = process.env;
const toEnglish = require("./rus2eng");

const scrapTorrent = async (topicId, topicPage) => {
  const filename = topicPage("#topic-title").text().trim();
  const filesize = topicPage("#t-tor-stats tr .borderless b")
    .eq(0)
    .text()
    .trim();
  const seeders = topicPage("#t-tor-stats tr .seed b").text().trim();
  const leechers = topicPage("#t-tor-stats tr .leech b").text().trim();
  const totalSnatches = topicPage("#t-tor-stats tr .borderless b")
    .eq(2)
    .text()
    .trim();
  const snatches = totalSnatches.match(/([\d,]+)/);
  const magnet = topicPage(".magnet-link").attr("href");
  const infoHash = topicPage(".magnet-link").attr("title");
  const uploadedDate = topicPage(".attach tbody tr")
    .eq(1)
    .find(".inlined li")
    .eq(0)
    .text()
    .trim();
  const dlId = topicPage(".dl-stub.dl-link.dl-topic").attr("href");
  const torrentDlId = `${ruTracker}/forum/${dlId}`;

  return {
    filename,
    filesize,
    seeders: parseInt(seeders, 10),
    leechers: leechers.length === 0 ? 0 : parseInt(leechers, 10),
    snatches: snatches ? parseInt(snatches[1].replace(/,/g, ""), 10) : 0,
    magnet,
    infohash: infoHash,
    date: toEnglish(uploadedDate),
    topicId,
    downloadId: torrentDlId,
  };
};

module.exports = scrapTorrent;
