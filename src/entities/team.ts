import { Position, TeamStats } from "@/entities/record";

export type Lineup = {
  options: {
    liberoSwitchMode: 0 | 1 | 2;
    liberoSwitchPosition:
      | Position.NONE
      | Position.OH
      | Position.MB
      | Position.OP;
  };
  starting: {
    _id: string;
    position: Position;
  }[];
  liberos: {
    _id: string;
    position: Position;
  }[];
  substitutes: {
    _id: string;
  }[];
};

export enum Role {
  MEMBER,
  OWNER,
  ADMIN,
}

export type Member = {
  _id: string;
  email?: string;
  role: Role;
  user_id?: string;
};

export type Team = {
  _id: string;
  name: string;
  nickname?: string;
  members: Member[];
  lineups: Lineup[];
  stats?: TeamStats[];
  createdAt?: Date;
  updatedAt?: Date;
};
