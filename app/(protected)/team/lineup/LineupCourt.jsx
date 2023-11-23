import { useDispatch } from "react-redux";

import { teamActions } from "../team-slice";
import { Section } from "@/app/components/common/Section";
import {
  CourtContainer,
  Outside,
  OutsideFront,
  Inside,
  PlayerCard,
  PlayerCardCross,
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

  return (
    <Section>
      <CourtContainer>
        <Outside>
          <OutsideFront />
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
      </CourtContainer>
    </Section>
  );
};

export default LineupCourt;
