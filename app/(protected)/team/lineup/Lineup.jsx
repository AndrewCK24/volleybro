import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { teamActions } from "../team-slice";
import LineupCourt from "./LineupCourt";
import LineupOptions from "./LineupOptions";

const Lineup = () => {
  const router = useRouter();
  const dispatch = useDispatch();
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
  const { starters, liberos } = editingLineup;

  const handleSave = async () => {
    const lineup = {
      starters,
      liberos,
    };
    try {
      const response = await fetch("/api/teams", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamId,
          lineup,
        }),
      });
      const { userData, teamData, membersData } = await response.json();
      dispatch(teamActions.setTeam({ userData, teamData, membersData }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    router.push("/team");
    dispatch(teamActions.resetEditingLineup());
  };

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
        members={members}
        editingLineup={editingLineup}
        editingZone={editingZone}
        editingMember={editingMember}
        setEditingZone={setEditingZone}
        setEditingMember={setEditingMember}
        handleSave={handleSave}
        handleCancel={handleCancel}
      />
    </>
  );
};

export default Lineup;
