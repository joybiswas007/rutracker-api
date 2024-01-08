require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const { PORT } = process.env;
const app = express();
const port = PORT || 10000;

app.use(helmet());
app.disable("x-powered-by");
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
  console.log(`Server running on port ${port}`);
});
