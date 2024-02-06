const router = require("express").Router();
const findTorrentsInDB = require("../utils/findTorrentsInDB");
const logger = require("../configs/logger");

router.post("/", async (req, res) => {
  try {
    const { search } = req.body;
    const findTorrents = await findTorrentsInDB(search);
    if (findTorrents.length > 0) {
      return res.status(202).send(findTorrents);
    }
    res
      .status(404)
      .send({ statusCode: 404, error: "Nothing in database yet." });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
