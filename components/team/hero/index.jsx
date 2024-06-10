"use client";
import { useTeam } from "@/hooks/use-data";

const TeamHero = ({ teamId }) => {
  const { team } = useTeam(teamId);

  return (
    <div className="w-full h-[7.5rem] bg-primary flex flex-col justify-end p-2">
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
