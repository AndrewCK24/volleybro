import { Schema, model, models } from "mongoose";

/**
 * @typedef {Object} VerificationToken
 * @param {String} email - Email
 * @param {Date} expires - Expires
 * @param {String} token - Token: the actual token value that will be sent to the user
 * @param {String} identifier - Identifier: "sign-up" or "forgot-password"
 */

const verificationTokenSchema = new Schema({
  email: {
    type: String,
    trim: true,
  },
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

verificationTokenSchema.index({ email: 1 }, { unique: true });

const VerificationToken =
  models.VerificationToken ||
  model("VerificationToken", verificationTokenSchema, "verificationTokens");
export default VerificationToken;
