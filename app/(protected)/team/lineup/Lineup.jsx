import { useState } from "react";
import { useSelector } from "react-redux";

import LineupCourt from "./LineupCourt";
import LineupOptions from "./LineupOptions";

const Lineup = () => {
  const [editingZone, setEditingZone] = useState(null);
  const [editingMember, setEditingMember] = useState({
    _id: null,
    number: null,
  });
  const {
    _id: teamId,
    members,
    editingLineup,
  } = useSelector((state) => state.team);

  return (
    <>
      <LineupCourt
        members={members}
        editingLineup={editingLineup}
        editingZone={editingZone}
        editingMember={editingMember}
        setEditingZone={setEditingZone}
        setEditingMember={setEditingMember}
      />
      <LineupOptions
        teamId={teamId}
        members={members}
        editingLineup={editingLineup}
        editingZone={editingZone}
        editingMember={editingMember}
        setEditingZone={setEditingZone}
        setEditingMember={setEditingMember}
      />
    </>
  );
};

export default Lineup;
