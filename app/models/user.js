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
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: "Team",
        required: true,
      },
    ],
    invitingTeams: [
      {
        _id: {
          type: Schema.Types.ObjectId,
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

const User = models.User || model("User", userSchema, "users");
export default User;
