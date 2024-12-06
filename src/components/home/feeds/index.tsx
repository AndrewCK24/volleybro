"use client";
import { useUser } from "@/hooks/use-data";
import TeamMatches from "@/components/home/matches";
import LoadingCard from "@/components/custom/loading/card";

const Feeds = () => {
  const { user, isLoading } = useUser();

  if (isLoading) return <LoadingCard className="w-full" />;
  if (!user) return null;

  const defaultTeamId = user.teams.joined[0].toString();
  return <TeamMatches teamId={defaultTeamId} />;
};

export default Feeds;
