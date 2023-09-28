const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
  teamIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
  ],
  invitingTeamIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
  ],
});

const User = mongoose.model("User", userSchema, "users");
module.exports = User;
