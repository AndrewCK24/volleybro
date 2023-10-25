import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
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
    teams: {
      joined: [
        {
          type: Schema.Types.ObjectId,
          ref: "Team",
          required: false,
        },
      ],
      inviting: [
        {
          type: Schema.Types.ObjectId,
          ref: "Team",
          required: false,
        },
      ],
    },
    info: {
      type: Object,
      required: false,
    },
    preferences: {
      type: Object,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", userSchema, "users");
export default User;
