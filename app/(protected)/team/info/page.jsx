"use client";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import TeamInfo from "../TeamInfo";

const TeamInfoPage = () => {
  const teamData = useSelector((state) => state.team);
  const membersData = useSelector((state) => state.team.members);
  return (
    <Card className="w-full">
      <TeamInfo teamData={teamData} membersData={membersData} />
    </Card>
  );
};

export default TeamInfoPage;
