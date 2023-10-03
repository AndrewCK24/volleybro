const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    teams: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Team",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
    invitingTeams: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Team",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema, "users");
module.exports = User;
