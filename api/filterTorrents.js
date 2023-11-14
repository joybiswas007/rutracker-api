//Filter dead torrents and exclude them in results

const filterTorrents = (res, torrents) => {
    const filteredTorrents = torrents.filter(
      (torrent) => torrent.seeders !== "0"
    );
    if (filteredTorrents.length > 0) {
      res.status(202).send(filteredTorrents);
    } else {
      res.status(404).send({ error: "No magnets found :(" });
    }
  };
  
  module.exports = filterTorrents;