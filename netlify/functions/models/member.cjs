const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  info: {
    email: {
      type: String,
      ref: "User",
      required: false,
    },
    admin: {
      type: Boolean,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
  },
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
  stats: {
    type: Object,
    required: false,
  }
});

const Member = mongoose.model("Member", memberSchema, "members");
module.exports = Member;
