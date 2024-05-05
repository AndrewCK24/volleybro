"use client";
import useSWR from "swr";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { matchActions } from "@/app/match/match-slice";
import { Main } from "@/components/layout/Main";
import Header from "../Header";

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

  useEffect(() => {
    if (data) dispatch(matchActions.setMatch(data));
  }, [data, dispatch]);
  if (error) throw error;
  if (isLoading) return <div>Loading...</div>;

  return (
    <Main className="p-0 overflow-hidden overscroll-y-none">
      <Header matchId={matchId} />
      {children}
    </Main>
  );
};

export default RecordLayout;
