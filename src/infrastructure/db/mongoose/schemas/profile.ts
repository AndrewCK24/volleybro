import {
  Schema,
  model,
  models,
  type Document,
  type Model,
  type Types,
} from "mongoose";

export interface ProfileDocument extends Document {
  userId: Types.ObjectId;
  info?: Record<string, unknown>;
  preferences?: Record<string, unknown>;
}

const profileSchema = new Schema<ProfileDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    info: {
      type: Object,
      required: false,
    },
    preferences: {
      type: Object,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Profile =
  (models.Profile as Model<ProfileDocument>) ||
  model<ProfileDocument>("Profile", profileSchema, "profiles");

export default Profile;
