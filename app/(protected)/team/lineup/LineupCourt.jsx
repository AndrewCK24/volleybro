import { useDispatch } from "react-redux";

import { teamActions } from "../team-slice";
import { FiRotateCw } from "react-icons/fi";
import { Section } from "@/app/components/common/Section";
import {
  CourtContainer,
  Outside,
  Inside,
  PlayerCard,
  AdjustButton,
} from "@/app/components/common/Court";

const LineupCourt = ({ members, editingLineup }) => {
  const dispatch = useDispatch();
  const { starters, liberos, status } = editingLineup;
  const { editingZone, editingMember } = status;

  return (
    <Section>
      <CourtContainer>
        <Outside className="left">
          <AdjustButton onClick={() => dispatch(teamActions.rotateLineupCw())}>
            <FiRotateCw />
            輪轉
          </AdjustButton>
          {liberos.map((libero, index) => {
            const member = members.find((m) => m._id === libero.member_id);
            return (
              <PlayerCard
                key={index}
                className={editingZone === index + 7 && "toggled"}
                onClick={() =>
                  dispatch(teamActions.setEditingStatus({ zone: index + 1 }))
                }
              >
                {editingZone === index + 7 && editingMember._id ? (
                  <>
                    <h3>{editingMember.number}</h3>
                    <span />
                  </>
                ) : member ? (
                  <>
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
                onClick={() =>
                  dispatch(teamActions.setEditingStatus({ zone: index + 1 }))
                }
              >
                {editingZone === index + 1 && editingMember._id ? (
                  <>
                    <h3>{editingMember.number}</h3>
                    <span />
                  </>
                ) : member ? (
                  <>
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
    </Section>
  );
};

export default LineupCourt;
