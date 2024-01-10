"use client";
import { useSelector } from "react-redux";
import { Section } from "@/app/components/common/Section";
import Record from "../../Record";

const RecordsPage = () => {
  const { setNum } = useSelector((state) => state.match.status.editingData);
  const { records } = useSelector((state) => state.match.sets[setNum]);

  return (
    <Section type="fixed">
      {records.map((record) => (
        <Record record={record} />
      ))}
    </Section>
  );
};

export default RecordsPage;
