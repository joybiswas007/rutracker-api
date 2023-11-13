require("dotenv").config({path: "../.env"});

const headers = (contentType) => ({
    headers: {
      Cookie: process.env.COOKIE,
      "Content-Type": contentType,
      "User-Agent": process.env.USER_AGENT,
    },
  });

  module.exports = headers;
