"use client";
import TeamMatches from "@/src/components/team/matches";

const TeamFeeds = ({ teamId }) => {
  return <TeamMatches teamId={teamId} className="w-full" />;
};

export default TeamFeeds;
