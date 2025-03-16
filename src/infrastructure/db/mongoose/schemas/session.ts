import { Schema, model, models, type Document, type Model } from "mongoose";

export interface SessionDocument extends Document {
  expires: Date;
  sessionToken: string;
  userId: string;
}

const sessionSchema = new Schema<SessionDocument>({
  expires: {
    type: Date,
    trim: true,
  },
  sessionToken: {
    type: String,
    trim: true,
  },
  userId: {
    type: String,
    ref: "User",
  },
});

export const Session =
  (models.Session as Model<SessionDocument>) ||
  model<SessionDocument>("Session", sessionSchema, "sessions");
export default Session;
