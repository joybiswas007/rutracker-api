const mongoose = require("mongoose");
const { schemaOptions } = require("../config");

const rutrackerSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    filesize: { type: String, required: true },
    seeders: { type: Number, required: true },
    leechers: { type: Number, required: true },
    snatches: { type: Number, required: true },
    magnet: { type: String, required: true },
    infohash: { type: String, required: true },
    uploadedDate: { type: Date, required: true },
    topicId: { type: String, required: true },
    downloadId: { type: String, required: true },
  },
  schemaOptions
);

const Search = mongoose.model("Search", rutrackerSchema);

module.exports = Search;
