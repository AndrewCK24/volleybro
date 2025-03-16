import {
  Schema,
  model,
  models,
  type Document,
  type Model,
  type Types,
} from "mongoose";

export interface MemberDocument extends Document {
  team_id: Types.ObjectId;
  name: string;
  number: number;
  info?: object;
  stats?: object;
}

const memberSchema = new Schema<MemberDocument>(
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

export const Member =
  (models.Member as Model<MemberDocument>) ||
  model<MemberDocument>("Member", memberSchema, "members");
export default Member;
