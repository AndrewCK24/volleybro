"use client";
import { useTeamRecords } from "@/hooks/use-data";
import Result from "@/components/home/matches/result";
import LoadingCard from "@/components/custom/loading/card";

const TeamMatches = ({ teamId }: { teamId: string }) => {
  const { records, isLoading } = useTeamRecords(teamId);

  if (isLoading) return <LoadingCard className="w-full" />;

  return (
    <div className="flex flex-col w-full gap-2 py-2">
      {records.length ? (
        records.map((record) => {
          return <Result key={record._id} record={record} />;
        })
      ) : (
        <p>沒有比賽</p>
      )}
    </div>
  );
};

export default TeamMatches;
