"use client";
import TeamMatches from "@/components/team/matches";

const TeamFeeds = ({ teamId }: { teamId: string }) => {
  return <TeamMatches teamId={teamId} className="w-full" />;
};

export default TeamFeeds;
