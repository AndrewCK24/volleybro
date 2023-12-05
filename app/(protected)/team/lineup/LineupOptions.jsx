import { useDispatch } from "react-redux";
import { teamActions } from "../team-slice";
import { FiSave } from "react-icons/fi";

import { Section } from "@/app/components/common/Section";
import { ListItem } from "@/app/components/common/List";
import BenchList from "./BenchList";
import PositionList from "./PositionList";

const LineupOptions = ({
  teamId,
  members,
  editingLineup,
  editingZone,
  editingMember,
  setEditingZone,
  setEditingMember,
}) => {
  const dispatch = useDispatch();
  const { starters, liberos, benches, edited } = editingLineup;
  const isStarterFilled = starters.every((starter) => starter.member_id);

  const handleSaveLineup = async () => {
    const lineup = {
      starters,
      liberos,
      benches,
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

  return (
    <>
      <Section type="fixed">
        {!isStarterFilled && (
          <ListItem type="danger" text>
            先發滿 6 位才能儲存陣容及紀錄比賽
          </ListItem>
        )}
        {!(editingZone && editingMember._id) ? (
          <BenchList
            members={members}
            benches={benches}
            editingZone={editingZone}
            editingMember={editingMember}
            setEditingMember={setEditingMember}
          />
        ) : (
          <PositionList
            starters={starters}
            editingZone={editingZone}
            editingMember={editingMember}
            setEditingZone={setEditingZone}
            setEditingMember={setEditingMember}
          />
        )}
      </Section>
      <Section type="transparent">
        <ListItem
          type={
            !edited || editingZone || !isStarterFilled ? "secondary" : "primary"
          }
          center
          disabled={!edited || editingZone || !isStarterFilled}
          onClick={handleSaveLineup}
        >
          <FiSave />
          儲存陣容
        </ListItem>
      </Section>
    </>
  );
};

export default LineupOptions;
