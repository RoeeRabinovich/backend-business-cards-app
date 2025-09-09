const mongoose = require("mongoose");

const Name = new mongoose.Schema({
  first: {
    type: String,
    minLength: 2,
    required: true,
  },
  middle: {
    type: String,
    default: "",
  },
  last: {
    type: String,
    minLength: 2,
    required: true,
  },
});

module.exports = Name;
