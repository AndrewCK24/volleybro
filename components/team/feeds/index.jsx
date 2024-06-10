"use client";
import { useTeam } from "@/hooks/use-data";
import LatestMatch from "@/components/team/feeds/latest-match";
import LoadingCard from "@/components/custom/loading/card";

const TeamFeeds = ({ teamId }) => {
  const { isLoading } = useTeam(teamId);

  if (isLoading) return <LoadingCard />;

  return <LatestMatch teamId={teamId} />;
};

export default TeamFeeds;
