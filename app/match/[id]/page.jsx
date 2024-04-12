"use client";
import { Section } from "../../components/common/Section";
import MatchCourt from "../MatchCourt";
import Preview from "../Preview";
import Options from "../Options";

const RecordPage = () => {
  return (
    <>
      <Section>
        <MatchCourt />
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
