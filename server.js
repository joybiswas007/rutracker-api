require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 10000;
app.use(express.json());
app.use(cors());

//Import routes
const search = require("./api/routes/rutracker/search");
const hashSearch = require("./api/routes/rutracker/hashSearch");

//Use routes
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
