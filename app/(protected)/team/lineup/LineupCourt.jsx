import { useDispatch } from "react-redux";

import { teamActions } from "../team-slice";
import { FiRotateCw } from "react-icons/fi";
import { Section } from "@/app/components/common/Section";
import { FormSelect } from "@/app/components/common/Form";
import {
  CourtContainer,
  Outside,
  Inside,
  PlayerCard,
  PlayerCardCross,
  AdjustButton,
} from "@/app/components/common/Court";

const LineupCourt = ({
  members,
  starters,
  liberos,
  editingZone,
  editingMember,
  setEditingZone,
  setEditingMember,
}) => {
  const dispatch = useDispatch();
  const handleClick = (index, player) => {
    setEditingMember({ _id: null, position: null });
    if (editingZone === index + 1) {
      setEditingZone(null);
      if (player.member_id && !editingMember._id) {
        dispatch(
          teamActions.resetLineupPlayer({
            zone: index + 1,
            member_id: player.member_id,
          })
        );
      }
    } else {
      setEditingZone(index + 1);
    }
  };

  const handleServingChange = (value) => {
    if (value === "true") {
      dispatch(teamActions.rotateLineupCw());
    } else {
      dispatch(teamActions.rotateLineupCcw());
    }
  };

  return (
    <Section>
      <CourtContainer>
        <Outside className="left">
          <AdjustButton onClick={() => dispatch(teamActions.rotateLineupCw())}>
            <h3>
              <FiRotateCw />
            </h3>
            輪轉
          </AdjustButton>
          {liberos.map((libero, index) => {
            const member = members.find((m) => m._id === libero.member_id);
            return (
              <PlayerCard
                key={index}
                className={editingZone === index + 7 && "toggled"}
                onClick={() => handleClick(index + 6, libero)}
              >
                {editingZone === index + 7 && editingMember._id ? (
                  <>
                    <h3>{editingMember.number}</h3>
                    <span />
                  </>
                ) : member ? (
                  <>
                    {editingZone === index + 7 && <PlayerCardCross />}
                    <h3>{member.number}</h3>
                    <span>L</span>
                  </>
                ) : null}
              </PlayerCard>
            );
          })}
        </Outside>
        <Inside>
          {starters.map((starter, index) => {
            const member = members.find((m) => m._id === starter.member_id);
            return (
              <PlayerCard
                key={index}
                style={{ gridArea: `z${index + 1}` }}
                className={editingZone === index + 1 && "toggled"}
                onClick={() => handleClick(index, starter)}
              >
                {editingZone === index + 1 && editingMember._id ? (
                  <>
                    <h3>{editingMember.number}</h3>
                    <span />
                  </>
                ) : member ? (
                  <>
                    {editingZone === index + 1 && <PlayerCardCross />}
                    <h3>{member.number}</h3>
                    <span>{starter.position}</span>
                  </>
                ) : null}
              </PlayerCard>
            );
          })}
        </Inside>
        <Outside className="right" />
      </CourtContainer>
      <FormSelect
        name="serving"
        options={[
          { id: "ours", value: true, text: "我方發球" },
          { id: "oppo", value: false, text: "對方發球" },
        ]}
        defaultValue={true}
        onChange={handleServingChange}
      />
    </Section>
  );
};

export default LineupCourt;
