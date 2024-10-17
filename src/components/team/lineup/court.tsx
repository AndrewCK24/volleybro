import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { lineupActions } from "@/lib/features/team/lineup-slice";
import { FiRefreshCw } from "react-icons/fi";
import {
  Court,
  Outside,
  Inside,
  PlayerCard,
  AdjustButton,
} from "@/components/custom/court";

import { LineupOptionMode } from "@/lib/features/team/types";

const LineupCourt = ({ members }) => {
  const dispatch = useAppDispatch();
  const { lineups, status } = useAppSelector((state) => state.lineup);

  return (
    <Court>
      <Outside className="inner">
        {status.optionMode === "" ? (
          <AdjustButton onClick={() => dispatch(lineupActions.rotateLineup())}>
            <FiRefreshCw />
            輪轉
          </AdjustButton>
        ) : (
          <AdjustButton />
        )}
        {lineups[status.lineupIndex]?.liberos &&
          lineups[status.lineupIndex].liberos.map((libero, index) => {
            const member = members?.find((m) => m._id === libero._id);
            const player = member
              ? {
                  ...member,
                  position: libero?.position || "",
                }
              : null;
            return (
              <PlayerCard
                key={index}
                player={player}
                list="liberos"
                zone={index + 1}
                onCardClick={() =>
                  dispatch(
                    lineupActions.setEditingPlayer({
                      _id: libero?._id || null,
                      list: "liberos",
                      zone: index + 1,
                    })
                  )
                }
                onSwitchClick={() =>
                  dispatch(
                    lineupActions.setOptionMode(LineupOptionMode.SUBSTITUTES)
                  )
                }
                onCrossClick={() =>
                  dispatch(lineupActions.removeEditingPlayer())
                }
                editingMember={status.editingMember}
              />
            );
          })}
        {lineups[status.lineupIndex]?.liberos.length < 2 && (
          <PlayerCard
            player={null}
            list="liberos"
            zone={lineups[status.lineupIndex]?.liberos.length + 1}
            onCardClick={() =>
              dispatch(
                lineupActions.setEditingPlayer({
                  _id: null,
                  list: "liberos",
                  zone: lineups[status.lineupIndex]?.liberos.length + 1,
                })
              )
            }
            onSwitchClick={() =>
              dispatch(
                lineupActions.setOptionMode(LineupOptionMode.SUBSTITUTES)
              )
            }
            onCrossClick={() => dispatch(lineupActions.removeEditingPlayer())}
            editingMember={status.editingMember}
          />
        )}
      </Outside>
      <Inside>
        {lineups[status.lineupIndex]?.starting &&
          lineups[status.lineupIndex].starting.map((starting, index) => {
            const member = members?.find((m) => m._id === starting._id);
            const player = member
              ? {
                  ...member,
                  position: starting?.position || "",
                }
              : null;
            return (
              <PlayerCard
                key={index}
                player={player}
                list="starting"
                zone={index + 1}
                onCardClick={() =>
                  dispatch(
                    lineupActions.setEditingPlayer({
                      _id: starting?._id || null,
                      list: "starting",
                      zone: index + 1,
                    })
                  )
                }
                onSwitchClick={() =>
                  dispatch(
                    lineupActions.setOptionMode(LineupOptionMode.SUBSTITUTES)
                  )
                }
                onCrossClick={() =>
                  dispatch(lineupActions.removeEditingPlayer())
                }
                editingMember={status.editingMember}
              />
            );
          })}
      </Inside>
    </Court>
  );
};

export default LineupCourt;
