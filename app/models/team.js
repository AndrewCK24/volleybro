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
        type: Schema.Types.ObjectId,
        ref: "Member",
        required: true,
      },
    ],
    lineup: {
      starting: [
        {
          member_id: {
            type: Schema.Types.ObjectId,
            ref: "Member",
            required: false,
          },
          position: {
            type: String,
            required: false,
          },
        },
      ],
      liberos: [
        {
          member_id: {
            type: Schema.Types.ObjectId,
            ref: "Member",
            required: false,
          },
          position: {
            type: String,
            required: false,
          },
        },
      ],
      substitutes: [
        { type: Schema.Types.ObjectId, ref: "Member", required: false },
      ],
      others: [{ type: Schema.Types.ObjectId, ref: "Member", required: false }],
    },
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
