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
        info: {
          admin: {
            type: Boolean,
            required: false,
          },
          email: {
            type: String,
            ref: "User",
            required: false,
          },
          userId: {
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
        role: {
          type: String,
          required: false,
        },
        stats: {
          type: Object,
          required: false,
        },
      },
    ],
    matchIds: [
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
