"use client";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { matchActions } from "../match-slice";
import { Section } from "../../components/common/Section";
import MatchCourt from "../MatchCourt";
import Preview from "../Preview";
import Options from "../Options";

const RecordPage = ({ params }) => {
  const { id: matchId } = params;
  const router = useRouter();
  const dispatch = useDispatch();
  const isMatchDataLoaded = useSelector((state) => state.match._id) === matchId;

  if (!isMatchDataLoaded) {
    const fetcher = (url) => fetch(url).then((res) => res.json());
    const { data, error, isLoading } = useSWR(
      `/api/matches/${matchId}`,
      fetcher
    );
    if (error) throw error;
    if (isLoading) return <div>Loading...</div>;
    dispatch(matchActions.setMatch(data));
  }

  return (
    <>
      <Section>
        <MatchCourt />
      </Section>
      <Section>
        <Preview onClick={() => router.push(`/match/${matchId}/records`)} />
      </Section>
      <Section type="fixed" style={{ minHeight: "50rem" }}>
        <Options />
      </Section>
    </>
  );
};

export default RecordPage;
