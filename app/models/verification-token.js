import { Schema, model, models } from "mongoose";

const verificationTokenSchema = new Schema({
  expires: {
    type: Date,
    trim: true,
  },
  token: {
    type: String,
    trim: true,
  },
  identifier: {
    type: String,
    trim: true,
  },
});

const VerificationToken =
  models.VerificationToken ||
  model("VerificationToken", verificationTokenSchema, "verificationTokens");
export default VerificationToken;
