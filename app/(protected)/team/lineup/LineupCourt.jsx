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
  const { editingMember, replacingMember } = status;

  return (
    <CourtContainer>
      <Outside className="left">
        {editingMember.zone === null ? (
          <AdjustButton onClick={() => dispatch(teamActions.rotateLineupCw())}>
            <FiRefreshCw />
            輪轉
          </AdjustButton>
        ) : (
          <AdjustButton />
        )}
        {liberos.map((libero, index) => {
          const member = members.find((m) => m._id === libero._id);
          return (
            <PlayerCard
              key={index}
              className={`
                ${editingMember.zone === index + 7 && "toggled"}`}
              onClick={() =>
                dispatch(
                  teamActions.setEditingStatus({
                    zone: index + 7,
                    _id: member?._id || null,
                    number: member?.number || null,
                    position: libero.position || "",
                  })
                )
              }
            >
              {editingMember.zone === index + 7 && editingMember._id ? (
                <>
                  <h3>{editingMember.number || member?.number}</h3>
                  <span />
                </>
              ) : (
                <>
                  <h3>{member.number}</h3>
                  <span>
                    {editingMember.zone > 0 &&
                    editingMember.zone !== index + 7 ? (
                      <FiRepeat />
                    ) : (
                      libero.position || ""
                    )}
                  </span>
                </>
              )}
            </PlayerCard>
          );
        })}
      </Outside>
      <Inside>
        {starting.map((starting, index) => {
          const member = members.find((m) => m._id === starting._id);
          return (
            <PlayerCard
              key={index}
              style={{ gridArea: `z${index + 1}` }}
              className={`
                ${editingMember.zone === index + 1 && "toggled"}`}
              onClick={() =>
                dispatch(
                  teamActions.setEditingStatus({
                    zone: index + 1,
                    _id: member?._id || null,
                    number: member?.number || null,
                    position: starting.position || "",
                  })
                )
              }
            >
              {editingMember.zone === index + 1 && editingMember._id ? (
                <>
                  <h3>{replacingMember.number || member?.number}</h3>
                  <span />
                </>
              ) : (
                <>
                  <h3>{member.number}</h3>
                  <span>
                    {editingMember._id && editingMember.zone > 0 ? (
                      <FiRepeat />
                    ) : (
                      starting.position || ""
                    )}
                  </span>
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
