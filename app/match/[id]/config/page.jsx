"use client";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { teamActions } from "@/app/(protected)/team/team-slice";
import { Section } from "@/app/components/common/Section";
import LineupCourt from "@/app/(protected)/team/lineup/LineupCourt";
import LineupOptions from "@/app/(protected)/team/lineup/LineupOptions";
import Info from "./Info";

const ConfigPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    _id: teamId,
    members,
    editingLineup,
  } = useSelector((state) => state.team);
  const { edited, status, starters, liberos } = editingLineup;

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
    dispatch(teamActions.resetEditingLineup());
  };

  return (
    <>
      <Section>
        <LineupCourt members={members} editingLineup={editingLineup} />
      </Section>
      <Section type="fixed">
        {edited || status.editingZone ? (
          <LineupOptions
            members={members}
            editingLineup={editingLineup}
            handleSave={handleSave}
            handleCancel={handleCancel}
          />
        ) : (
          <Info />
        )}
      </Section>
    </>
  );
};

export default ConfigPage;