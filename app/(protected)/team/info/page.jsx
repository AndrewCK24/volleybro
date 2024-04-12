"use client";

import { useSelector } from "react-redux";
import TeamInfo from "../TeamInfo";

const TeamInfoPage = () => {
  const teamData = useSelector((state) => state.team);
  const membersData = useSelector((state) => state.team.members);
  return <TeamInfo teamData={teamData} membersData={membersData} />;
};

export default TeamInfoPage;
