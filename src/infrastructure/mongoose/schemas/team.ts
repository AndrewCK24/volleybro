import { Schema, model, models } from "mongoose";
import { Role } from "@/entities/team";
import { Position } from "@/entities/record";

export const lineupSchema = new Schema({
  options: {
    liberoSwitchMode: { type: Number, enum: [0, 1, 2], default: 0 },
    liberoSwitchPosition: {
      type: String,
      enum: Position,
      default: Position.NONE,
    },
  },
  starting: [
    {
      _id: { type: Schema.Types.ObjectId, ref: "Member" },
      position: { type: String, enum: Position },
    },
  ],
  liberos: [
    {
      _id: { type: Schema.Types.ObjectId, ref: "Member" },
      position: { type: String, enum: Position },
    },
  ],
  substitutes: [
    {
      _id: { type: Schema.Types.ObjectId, ref: "Member" },
    },
  ],
});

const teamSchema = new Schema(
  {
    name: { type: String, required: true },
    nickname: { type: String },
    members: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "Member" },
        email: { type: String },
        role: { type: String, enum: [Role.MEMBER, Role.OWNER, Role.ADMIN] },
        user_id: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    lineups: [lineupSchema],
    stats: { type: Object },
  },
  {
    timestamps: true,
  }
);

export const Team = models.Team || model("Team", teamSchema, "teams");
export default Team;
