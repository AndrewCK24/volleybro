import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ListHeader, ListTitle } from "@/app/components/common/List";
import LineupConfig from "./(options)/LineupConfig";
import PlayerInfo from "./(options)/PlayerInfo";
import SubstituteList from "./(options)/SubstituteList";
import PositionList from "./(options)/PositionList";

const LineupOptions = () => {
  const [mode, setMode] = useState(""); // ["info", "substitutes", "positions"]
  const { members, editingLineup } = useSelector((state) => state.team);
  const { editingMember } = editingLineup.status;
  const member = members.find((m) => m._id === editingMember._id);

  useEffect(() => {
    if (editingMember.zone === null) setMode("");
  }, [editingMember.zone]);

  return (
    <>
      {editingMember.zone > 0 && editingMember._id && !mode ? (
        <>
          <ListHeader>
            <ListTitle>球員資訊</ListTitle>
          </ListHeader>
          <PlayerInfo setMode={setMode} />
        </>
      ) : (editingMember.zone > 0 && !editingMember._id) ||
        mode === "substitutes" ? (
        <>
          <ListHeader>
            <ListTitle>替補名單</ListTitle>
          </ListHeader>
          <SubstituteList />
        </>
      ) : mode === "positions" ? (
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
