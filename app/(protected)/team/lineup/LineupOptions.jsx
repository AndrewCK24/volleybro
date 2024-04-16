import { useSelector } from "react-redux";
import { ListHeader, ListTitle } from "@/app/components/common/List";
import LineupConfig from "./(options)/LineupConfig";
import MemberInfo from "../member/MemberInfo";
import SubstituteList from "./(options)/SubstituteList";
import PositionList from "./(options)/PositionList";

const LineupOptions = () => {
  const { members, editingLineup } = useSelector((state) => state.team);
  const { optionMode, editingMember } = editingLineup.status;
  const member = members.find((m) => m._id === editingMember._id);

  return (
    <>
      {optionMode === "playerInfo" ? (
        <MemberInfo member={member} />
      ) : optionMode === "substitutes" ? (
        <>
          <ListHeader>
            <ListTitle>替補名單</ListTitle>
          </ListHeader>
          <SubstituteList />
        </>
      ) : optionMode === "positions" ? (
        <>
          <ListHeader>
            <ListTitle>選擇位置</ListTitle>
          </ListHeader>
          <PositionList />
        </>
      ) : (
        <>
          <ListHeader>
            <ListTitle>陣容設定</ListTitle>
          </ListHeader>
          <LineupConfig />
        </>
      )}
    </>
  );
};

export default LineupOptions;
