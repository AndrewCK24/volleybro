import { useDispatch, useSelector } from "react-redux";
import { teamActions } from "../team-slice";
import { FiRefreshCw } from "react-icons/fi";
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

  return (
    <CourtContainer>
      <Outside className="inner">
        {status.optionMode === "" ? (
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
              member={member}
              list="liberos"
              zone={index + 1}
              onCardClick={() =>
                dispatch(
                  teamActions.setEditingPlayer({
                    _id: member?._id || null,
                    list: "liberos",
                    zone: index + 1,
                  })
                )
              }
              onCrossClick={() => dispatch(teamActions.removeEditingPlayer())}
              editingMember={status.editingMember}
            />
          );
        })}
      </Outside>
      <Inside>
        {starting.map((starting, index) => {
          const member = members.find((m) => m._id === starting._id);
          return (
            <PlayerCard
              key={index}
              member={member}
              list="starting"
              zone={index + 1}
              onCardClick={() =>
                dispatch(
                  teamActions.setEditingPlayer({
                    _id: member?._id || null,
                    list: "starting",
                    zone: index + 1,
                  })
                )
              }
              onSwitchClick={() =>
                dispatch(teamActions.setOptionMode("substitutes"))
              }
              onCrossClick={() => dispatch(teamActions.removeEditingPlayer())}
              editingMember={status.editingMember}
            />
          );
        })}
      </Inside>
    </CourtContainer>
  );
};

export default LineupCourt;
