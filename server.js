require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const app = express();
const { PORT } = process.env;
const port = PORT || 10000;

const logger = require("./logger");

app.use(helmet());
app.use(express.json());
app.use(cors());

// Import routes
const search = require("./api/routes/search");
const hashSearch = require("./api/routes/hashSearch");

// Use routes
app.use("/api/v1/search", search);
app.use("/api/v1/searchbyhash", hashSearch);

app.get("*", (req, res) => {
  res.status(405).send({
    method: req.method,
    error: "Method Not Allowed",
  });
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
