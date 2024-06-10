import { Schema, model, models } from "mongoose";

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
    },
    members: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "Member" },
        email: { type: String },
        role: { type: String, enum: ["owner", "admin", "member"] },
        user_id: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    lineups: [
      {
        config: {
          liberoMode: { type: Number, enum: [0, 1, 2] },
        },
        starting: [
          {
            _id: { type: Schema.Types.ObjectId, ref: "Member" },
            position: { type: String, enum: ["OH", "MB", "OP", "S"] },
          },
        ],
        liberos: [
          {
            _id: { type: Schema.Types.ObjectId, ref: "Member" },
            position: { type: String, enum: ["L"] },
          },
        ],
        substitutes: [
          {
            _id: { type: Schema.Types.ObjectId, ref: "Member" },
          },
        ],
      },
    ],
    matches: [
      {
        type: Schema.Types.ObjectId,
        ref: "Match",
      },
    ],
    stats: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

const Team = models.Team || model("Team", teamSchema, "teams");
export default Team;
