"use client";
import { useUser, useTeamRecords } from "@/hooks/use-data";
import { usePullToRefresh } from "@/lib/hooks/usePullToRefresh";
import Result from "@/components/home/result";
import LoadingCard from "@/components/custom/loading/card";

const TeamMatches = ({ teamId }: { teamId: string }) => {
  const { mutate: mutateUser } = useUser();
  const {
    records,
    mutate: mutateTeamRecords,
    isLoading,
  } = useTeamRecords(teamId);
  const mutate = () => {
    mutateUser();
    mutateTeamRecords();
  };

  usePullToRefresh(mutate);

  if (isLoading) return <LoadingCard className="w-full" />;

  return (
    <>
      {records.length ? (
        records.map((record) => {
          return <Result key={record._id} record={record} />;
        })
      ) : (
        <p>沒有比賽</p>
      )}
    </>
  );
};

const Home = () => {
  const { user, isLoading } = useUser();

  if (isLoading) return <LoadingCard className="w-full" />;
  if (!user) return null;
  const defaultTeamId = user.teams.joined[0].toString();

  return <TeamMatches teamId={defaultTeamId} />;
};

export default Home;
