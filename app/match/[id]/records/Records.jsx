import { useSelector } from "react-redux";
import Record from "../../Record";

const Records = () => {
  const { players } = useSelector((state) => state.match);
  const { setNum } = useSelector((state) => state.match.status.editingData);
  const { records } = useSelector((state) => state.match.sets[setNum]);

  return (
    <>
      {records.map((record) => (
        <Record record={record} players={players} />
      ))}
    </>
  );
};

export default Records;
