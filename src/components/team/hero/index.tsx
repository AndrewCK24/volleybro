"use client";
import { useTeam } from "@/hooks/use-data";

const TeamHero = ({ teamId }: { teamId: string }) => {
  const { team, isLoading, isValidating } = useTeam(teamId);

  return (
    <div className="w-full h-[7.5rem] bg-primary flex flex-col shrink-0 justify-end p-2">
      {!team || isLoading || isValidating ? (
        <p className="h-8 rounded-md animate-pulse bg-muted w-[16rem]" />
      ) : (
        <p className="text-2xl text-primary-foreground">
          {team?.name || "Loading..."}
        </p>
      )}
    </div>
  );
};

export default TeamHero;
