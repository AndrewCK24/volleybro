import { useDispatch } from "react-redux";

import { teamActions } from "../team-slice";
import { Section } from "@/app/components/common/Section";
import {
  CourtContainer,
  Outside,
  OutsideFront,
  InsideCourt,
  PlayerCard,
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
  const handleClick = (index, starter) => {
    setEditingMember({ _id: null, position: null });
    if (editingZone === index + 1) {
      setEditingZone(null);
    } else {
      setEditingZone(index + 1);
      if (starter.member_id) {
        dispatch(
          teamActions.resetLineupPlayer({
            zone: index + 1,
            member_id: starter.member_id,
          })
        );
      }
    }
  };

  return (
    <Section>
      <CourtContainer>
        <Outside>
          <OutsideFront></OutsideFront>
        </Outside>
        <InsideCourt>
          {starters.map((starter, index) => {
            if (editingZone === index + 1 && editingMember._id) {
              return (
                <PlayerCard
                  key={index}
                  style={{ gridArea: `z${index + 1}` }}
                  className="toggled"
                  onClick={() => handleClick(index, starter)}
                >
                  <h3>{editingMember.number}</h3>
                  <span />
                </PlayerCard>
              );
            } else {
              const member = members.find((m) => m._id === starter.member_id);
              return (
                <PlayerCard
                  key={index}
                  style={{ gridArea: `z${index + 1}` }}
                  className={editingZone === index + 1 && "toggled"}
                  onClick={() => handleClick(index, starter)}
                >
                  {member ? <h3>{member.number}</h3> : null}
                  {starter.position && <span>{starter.position}</span>}
                </PlayerCard>
              );
            }
          })}
        </InsideCourt>
        <Outside>
          <OutsideFront></OutsideFront>
        </Outside>
      </CourtContainer>
    </Section>
  );
};

export default LineupCourt;
