"use client";
import { useTeam } from "@/src/hooks/use-data";

const TeamHero = ({ teamId }: { teamId: string }) => {
  const { team } = useTeam(teamId);

  return (
    <div className="w-full h-[7.5rem] bg-primary flex flex-col flex-shrink-0 justify-end p-2">
      {!team ? (
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
