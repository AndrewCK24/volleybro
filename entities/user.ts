export type User = {
  _id: string;
  name: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  teams: {
    joined: string[];
    inviting: string[];
  };
  info?: Record<string, unknown>;
  preferences?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
};
