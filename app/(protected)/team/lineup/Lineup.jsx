import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { teamActions } from "../team-slice";
import { FiSave } from "react-icons/fi";
import { Section } from "@/app/components/common/Section";
import { ListItem } from "@/app/components/common/List";
import LineupCourt from "./LineupCourt";
import BenchList from "./BenchList";
import PositionList from "./PositionList";

const Lineup = () => {
  const [editingZone, setEditingZone] = useState(null);
  const [editingMember, setEditingMember] = useState({
    _id: null,
    number: null,
  });
  const members = useSelector((state) => state.team.members);
  const { starters, liberos, benches, edited } = useSelector(
    (state) => state.team.editingLineup
  );

  return (
    <>
      <LineupCourt
        members={members}
        starters={starters}
        liberos={liberos}
        benches={benches}
        editingZone={editingZone}
        editingMember={editingMember}
        setEditingZone={setEditingZone}
        setEditingMember={setEditingMember}
      />
      <Section type="fixed">
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
            liberos={liberos}
            editingZone={editingZone}
            editingMember={editingMember}
            setEditingZone={setEditingZone}
            setEditingMember={setEditingMember}
          />
        )}
      </Section>
      <Section type="transparent">
        <ListItem
          type={!edited || editingZone ? "secondary" : "primary"}
          center
          disabled={!edited || editingZone}
          onClick={() => console.log("clicked")}
        >
          <FiSave />
          儲存陣容
        </ListItem>
      </Section>
    </>
  );
};

export default Lineup;
