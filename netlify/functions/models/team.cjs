const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: false,
  },
  members: [
    {
      info: {
        admin: {
          type: Boolean,
          required: false,
        },
        email: {
          type: String,
          ref: "User",
          required: false,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: false,
        },
      },
      name: {
        type: String,
        required: false,
      },
      number: {
        type: Number,
        required: false,
      },
      role: {
        type: String,
        required: false,
      },
      stats: {
        type: Object,
        required: false,
      },
    },
  ],
  matchIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: false,
    },
  ],
  stats: {
    type: Object,
    required: false,
  },
});

const Team = mongoose.model("Team", teamSchema, "teams");
module.exports = Team;
