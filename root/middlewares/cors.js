const express = require("express");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:5500",
      "https://localhost:5173",
    ],
    optionsSuccessStatus: 200,
  })
);

module.exports = app;
