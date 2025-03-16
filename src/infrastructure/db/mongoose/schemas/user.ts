import {
  Schema,
  model,
  models,
  type Document,
  type Model,
  type Types,
} from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  teams: {
    joined: Types.ObjectId[];
    inviting: Types.ObjectId[];
  };
  info?: object;
  preferences?: object;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    emailVerified: {
      type: Date,
      required: false,
      trim: true,
    },
    image: {
      type: String,
      required: false,
      trim: true,
    },
    password: {
      type: String,
      required: false,
    },
    teams: {
      joined: [
        {
          type: Schema.Types.ObjectId,
          ref: "Team",
          required: false,
        },
      ],
      inviting: [
        {
          type: Schema.Types.ObjectId,
          ref: "Team",
          required: false,
        },
      ],
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
  }
);

userSchema.index({ email: 1 });

export const User =
  (models.User as Model<UserDocument>) ||
  model<UserDocument>("User", userSchema, "users");
export default User;
