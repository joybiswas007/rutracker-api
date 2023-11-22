const toEnglish = require("./rus2eng");
const scrapTorrent = async (...data) => {
  const filename = data[1]("#topic-title a").text().trim();
  const filesize = data[1]("#t-tor-stats tr .borderless b").eq(0).text().trim();
  const seeders = data[1]("#t-tor-stats tr .seed b").text().trim();
  const leechers = data[1]("#t-tor-stats tr .leech b").text().trim();
  const total_snatches = data[1]("#t-tor-stats tr .borderless b")
    .eq(2)
    .text()
    .trim();
  const snatches = total_snatches.match(/([\d,]+)/);
  const magnet = data[1](".magnet-link").attr("href");
  const info_hash = data[1](".magnet-link").attr("title");
  const uploaded_date = data[1](".attach tbody tr")
    .eq(1)
    .find(".inlined li")
    .eq(0)
    .text()
    .trim();
  const dlId = data[1](".dl-stub.dl-link.dl-topic").attr("href");
  const torrentDlId = `${data[2]}/forum/${dlId}`;

  return {
    filename,
    filesize,
    seeders: parseInt(seeders),
    leechers: leechers.length === 0 ? 0 : parseInt(leechers),
    snatches: snatches ? parseInt(snatches[1].replace(/,/g, ""), 10) : 0,
    magnet,
    infohash: info_hash,
    date: toEnglish(uploaded_date),
    topic: data[0],
    download_id: torrentDlId,
  };
};

module.exports = scrapTorrent;
