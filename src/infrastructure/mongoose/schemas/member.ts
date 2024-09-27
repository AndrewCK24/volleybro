import { Schema, model, models } from "mongoose";

const memberSchema = new Schema(
  {
    team_id: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    info: {
      type: Object,
    },
    stats: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

memberSchema.index({ team_id: 1 });

export const Member = models.Member || model("Member", memberSchema, "members");
export default Member;
