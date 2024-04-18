import { useSelector } from "react-redux";
import { ListHeader, ListTitle } from "@/app/components/common/List";
import LineupConfig from "./(options)/LineupConfig";
import MemberInfo from "../member/MemberInfo";
import BenchList from "./(options)/BenchList";
import PositionList from "./(options)/PositionList";

const LineupOptions = () => {
  const { members, editingLineup } = useSelector((state) => state.team);
  const { optionMode, editingMember } = editingLineup.status;
  const member = members.find((m) => m._id === editingMember._id);

  return (
    <>
      {optionMode === "playerInfo" ? (
        <MemberInfo member={member} />
      ) : optionMode === "substitutes" || optionMode === "others" ? (
        <BenchList />
      ) : optionMode === "positions" ? (
        <>
          <ListHeader>
            <ListTitle>選擇位置</ListTitle>
          </ListHeader>
          <PositionList />
        </>
      ) : (
        <LineupConfig />
      )}
    </>
  );
};

export default LineupOptions;
