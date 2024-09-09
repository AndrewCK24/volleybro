export type Lineup = {
  options: {
    liberoSwitchMode: 0 | 1 | 2;
    liberoSwitchPosition: "" | "OH" | "MB" | "OP";
  };
  starting: {
    _id: string;
    position: "OH" | "MB" | "OP" | "S";
  }[];
  liberos: {
    _id: string;
    position: "L";
  }[];
  substitutes: {
    _id: string;
  }[];
};

export type Member = {
  _id: string;
  email?: string;
  role: "owner" | "admin" | "member";
  user_id: string;
};

export type Team = {
  _id: string;
  name: string;
  nickname?: string;
  members: Member[];
  lineups: Lineup[];
  matches: string[];
  stats?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
};