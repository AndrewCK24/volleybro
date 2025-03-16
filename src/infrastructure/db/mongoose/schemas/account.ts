import { Schema, model, models, type Document, type Model } from "mongoose";

export interface AccountDocument extends Document {
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string;
  access_token: string;
  expires_at: number;
  token_type: string;
  scope: string;
  id_token: string;
  session_state: string;
  oauth_token_secret: string;
  oauth_token: string;
}

const accountSchema = new Schema<AccountDocument>({
  userId: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    trim: true,
  },
  provider: {
    type: String,
    trim: true,
  },
  providerAccountId: {
    type: String,
    trim: true,
  },
  refresh_token: {
    type: String,
    trim: true,
  },
  access_token: {
    type: String,
    trim: true,
  },
  expires_at: {
    type: Number,
    trim: true,
  },
  token_type: {
    type: String,
    trim: true,
  },
  scope: {
    type: String,
    trim: true,
  },
  id_token: {
    type: String,
    trim: true,
  },
  session_state: {
    type: String,
    trim: true,
  },
  oauth_token_secret: {
    type: String,
    trim: true,
  },
  oauth_token: {
    type: String,
    trim: true,
  },
});

export const Account =
  (models.Account as Model<AccountDocument>) ||
  model<AccountDocument>("Account", accountSchema, "accounts");
export default Account;
