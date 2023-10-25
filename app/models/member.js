import { Schema, model, models } from "mongoose";

const memberSchema = new Schema(
  {
    auth: {
      admin: {
        type: Boolean,
        required: true,
      },
      email: {
        type: String,
        ref: "User",
        required: false,
      },
      user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
      team_id: {
        type: Schema.Types.ObjectId,
        ref: "Team",
        required: true,
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
  {
    timestamps: true,
  }
);

const Member = models.Member || model("Member", memberSchema, "members");
export default Member;
