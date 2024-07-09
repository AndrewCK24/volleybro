"use client";
import { useSelector } from "react-redux";
import Rally from "../../../../components/record/rally";

const Records = () => {
  const { players } = useSelector((state) => state.match);
  const { setNum } = useSelector((state) => state.match.status.editingData);
  const { records } = useSelector((state) => state.match.sets[setNum]);

  return (
    <>
      {records.map((record, index) => (
        <Rally record={record} players={players} key={index} />
      ))}
    </>
  );
};

export default Records;
