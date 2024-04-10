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
      // TODO: 待前端 members 狀態從 team 獨立後，刪除此欄位
      // 以四種 lineup 名單代替
      {
        type: Schema.Types.ObjectId,
        ref: "Member",
        required: true,
      },
    ],
    lineup: {
      type: {
        starting: {
          type: [
            {
              _id: {
                type: Schema.Types.ObjectId,
                ref: "Member",
                required: false,
                auto: false,
              },
            },
          ],
          required: true,
        },
        liberos: {
          type: [
            {
              _id: {
                type: Schema.Types.ObjectId,
                ref: "Member",
                required: false,
                auto: false,
              },
            },
          ],
          required: true,
        },
        substitutes: {
          type: [
            {
              _id: {
                type: Schema.Types.ObjectId,
                ref: "Member",
                required: false,
                auto: false,
              },
            },
          ],
          required: true,
        },
        others: {
          type: [
            {
              _id: {
                type: Schema.Types.ObjectId,
                ref: "Member",
                required: false,
                auto: false,
              },
            },
          ],
          required: true,
        },
      },
      required: true,
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
