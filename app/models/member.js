import { Schema, model, models } from "mongoose";

const memberSchema = new Schema(
  {
    team_id: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    meta: {
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
    },
    name: {
      type: String,
      required: false,
    },
    number: {
      type: Number,
      required: false,
    },
    info: {
      type: Object,
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

memberSchema.index({ team_id: 1 });

const Member = models.Member || model("Member", memberSchema, "members");
export default Member;
