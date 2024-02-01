import { useDispatch, useSelector } from "react-redux";

import { teamActions } from "../team-slice";
import { FiRepeat, FiRefreshCw } from "react-icons/fi";
import {
  CourtContainer,
  Outside,
  Inside,
  PlayerCard,
  AdjustButton,
} from "@/app/components/common/Court";

const LineupCourt = () => {
  const dispatch = useDispatch();
  const { editingLineup, members } = useSelector((state) => state.team);
  const { starting, liberos, status } = editingLineup;
  const { editingZone, editingMember } = status;

  return (
    <CourtContainer>
      <Outside className="left">
        <AdjustButton onClick={() => dispatch(teamActions.rotateLineupCw())}>
          <FiRefreshCw />
          輪轉
        </AdjustButton>
        {liberos.map((libero, index) => {
          const member = members.find((m) => m._id === libero.member_id);
          return (
            <PlayerCard
              key={index}
              className={editingZone === index + 7 && "toggled"}
              onClick={() =>
                dispatch(teamActions.setEditingStatus({ zone: index + 7 }))
              }
            >
              {editingZone === index + 7 && editingMember._id ? (
                <>
                  <h3>{editingMember.number}</h3>
                  <span />
                </>
              ) : (
                <>
                  <h3>{member?.number || ""}</h3>
                  {editingZone > 0 && editingZone !== index + 7 ? (
                    <FiRepeat />
                  ) : (
                    <span>{libero.position || ""}</span>
                  )}
                </>
              )}
            </PlayerCard>
          );
        })}
      </Outside>
      <Inside>
        {starting.map((starting, index) => {
          const member = members.find((m) => m._id === starting.member_id);
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
              ) : (
                <>
                  <h3>{member?.number || ""}</h3>
                  {editingZone > 0 && editingZone !== index + 1 ? (
                    <FiRepeat />
                  ) : (
                    <span>{starting.position || ""}</span>
                  )}
                </>
              )}
            </PlayerCard>
          );
        })}
      </Inside>
      <Outside className="right" />
    </CourtContainer>
  );
};

export default LineupCourt;
