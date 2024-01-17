"use client";
import useSWR from "swr";
import { useDispatch, useSelector } from "react-redux";
import { matchActions } from "@/app/match/match-slice";

const RecordLayout = ({ params, children }) => {
  const { id: matchId } = params;
  const dispatch = useDispatch();
  const isMatchDataLoaded =
    useSelector((state) => state.match._id) === matchId || matchId === "new";

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR(
    !isMatchDataLoaded ? `/api/matches/${matchId}` : null,
    fetcher
  );
  if (error) throw error;
  if (isLoading) return <div>Loading...</div>;
  if (data) dispatch(matchActions.setMatch(data));

  return <>{children}</>;
};

export default RecordLayout;
