import { Schema, model, models } from "mongoose";

const sessionSchema = new Schema({
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

export const Session = models.Session || model("Session", sessionSchema, "sessions");
export default Session;
