import { Schema, model, models } from "mongoose";

const matchSchema = new Schema(
  {
    team_id: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    info: {
      team: {
        ours: {
          name: {
            type: String,
            required: false,
          },
        },
        oppo: {
          _id: {
            type: Schema.Types.ObjectId,
            ref: "Team",
            required: false,
          },
          name: {
            type: String,
            required: false,
          },
        },
      },
      match: {
        name: {
          type: String,
          required: false,
        },
        formal: {
          type: Boolean,
          required: false,
        },
        setCount: {
          type: Number,
          required: false,
        },
        finalSetPoint: {
          type: Number,
          required: false,
        },
      },
    },
    sets: [
      {
        firstServe: {
          type: Boolean,
          required: false,
        },
        records: [],
        lineup: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

matchSchema.index({ team_id: 1 });

const Match = models.Match || model("Match", matchSchema, "matches");
export default Match;
