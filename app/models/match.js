import { Schema, model, models } from "mongoose";

const matchSchema = new Schema(
  {
    win: {
      type: Boolean,
      required: false,
    },
    team_id: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    players: {
      type: Object,
      required: false,
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
        win: {
          type: Boolean,
          required: false,
        },
        meta: {
          firstServe: {
            type: Boolean,
            required: false,
          },
          rotateCount: {
            type: Number,
            required: false,
          },
          timeoutCount: {
            type: Number,
            required: false,
          },
          substituteCount: {
            type: Number,
            required: false,
          },
          challengeCount: {
            type: Number,
            required: false,
          },
        },
        records: [
          {
            type: Object,
            required: false,
          },
        ],
        lineup: {
          type: Object,
          required: false,
        },
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
