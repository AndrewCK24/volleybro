import { Schema, model, models } from "mongoose";

const teamSchema = new Schema(
  {
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
        member_id: {
          type: Schema.Types.ObjectId,
          ref: "Member",
          required: true,
        },
      },
    ],
    matches: [
      {
        type: Schema.Types.ObjectId,
        ref: "Match",
        required: false,
      },
    ],
    stats: {
      type: Object,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Team = models.Team || model("Team", teamSchema, "teams");
export default Team;
