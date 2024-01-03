"use client";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Section } from "../../components/common/Section";
import MatchCourt from "../MatchCourt";
import Options from "../Options";
import Preview from "../Preview";

const RecordPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { members } = useSelector((state) => state.team);
  const { starters, liberos } = useSelector((state) => state.team.lineup);
  return (
    <>
      <Section>
        <MatchCourt starters={starters} liberos={liberos} members={members} />
      </Section>
      <Section>
        <Preview />
      </Section>
      <Section type="fixed" style={{ minHeight: "50rem" }}>
        <Options />
      </Section>
    </>
  );
};

export default RecordPage;
