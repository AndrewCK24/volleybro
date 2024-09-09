export type Member = {
  _id: string;
  team_id: string;
  name: string;
  number: number;
  info?: Record<string, unknown>;
  stats?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
};
