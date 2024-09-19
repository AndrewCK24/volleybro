import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    emailVerified: {
      type: Date,
      required: false,
      trim: true,
    },
    image: {
      type: String,
      required: false,
      trim: true,
    },
    password: {
      type: String,
      required: false,
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

userSchema.index({ email: 1 });

const User = models.User || model("User", userSchema, "users");
export default User;
