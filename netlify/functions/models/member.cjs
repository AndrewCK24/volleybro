const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: false,
  },
  role: {
    type: String,
    required: true,
  },
});

const Member = mongoose.model("Member", memberSchema, "members");
module.exports = Member;
