const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  session: {
    type: String,
    required: false,
  },
  teams: [
    {
      type: String,
      required: false,
    },
  ],
  playerIds: [
    {
      type: String,
      required: false,
    },
  ],
});

const User = mongoose.model("User", userSchema, "users");
module.exports = User;
