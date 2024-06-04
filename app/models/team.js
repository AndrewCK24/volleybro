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
      // TODO: 待前端 members 狀態從 team 獨立後，刪除此欄位
      // 以四種 lineup 名單代替
      {
        type: Schema.Types.ObjectId,
        ref: "Member",
        required: true,
      },
    ],
    lineups: [
      {
        config: {
          liberoMode: {
            type: Number,
            enum: [0, 1, 2],
          },
        },
        starting: {
          type: [
            {
              _id: {
                type: Schema.Types.ObjectId,
                ref: "Member",
              },
              position: {
                type: String,
                enum: ["OH", "MB", "OP", "S"],
              },
            },
          ],
        },
        liberos: {
          type: [
            {
              _id: {
                type: Schema.Types.ObjectId,
                ref: "Member",
              },
              position: {
                type: String,
                enum: ["L"],
              },
            },
          ],
        },
        substitutes: {
          type: [
            {
              _id: {
                type: Schema.Types.ObjectId,
                ref: "Member",
              },
            },
          ],
        },
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
