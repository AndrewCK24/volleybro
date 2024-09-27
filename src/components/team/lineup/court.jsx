import { useDispatch, useSelector } from "react-redux";
import { lineupsActions } from "@/src/app/store/lineups-slice";
import { FiRefreshCw } from "react-icons/fi";
import {
  Court,
  Outside,
  Inside,
  PlayerCard,
  AdjustButton,
} from "@/src/components/custom/court";

const LineupCourt = ({ members }) => {
  const dispatch = useDispatch();
  const { lineups, status } = useSelector((state) => state.lineups);

  return (
    <Court>
      <Outside className="inner">
        {status.optionMode === "" ? (
          <AdjustButton onClick={() => dispatch(lineupsActions.rotateLineup())}>
            <FiRefreshCw />
            輪轉
          </AdjustButton>
        ) : (
          <AdjustButton />
        )}
        {lineups[status.lineupNum]?.liberos &&
          lineups[status.lineupNum].liberos.map((libero, index) => {
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
                    lineupsActions.setEditingPlayer({
                      _id: libero?._id || null,
                      list: "liberos",
                      zone: index + 1,
                    })
                  )
                }
                onSwitchClick={() =>
                  dispatch(lineupsActions.setOptionMode("substitutes"))
                }
                onCrossClick={() =>
                  dispatch(lineupsActions.removeEditingPlayer())
                }
                editingMember={status.editingMember}
              />
            );
          })}
        {lineups[status.lineupNum]?.liberos.length < 2 && (
          <PlayerCard
            player={null}
            list="liberos"
            zone={lineups[status.lineupNum]?.liberos.length + 1}
            onCardClick={() =>
              dispatch(
                lineupsActions.setEditingPlayer({
                  _id: null,
                  list: "liberos",
                  zone: lineups[status.lineupNum]?.liberos.length + 1,
                })
              )
            }
            onSwitchClick={() =>
              dispatch(lineupsActions.setOptionMode("substitutes"))
            }
            onCrossClick={() => dispatch(lineupsActions.removeEditingPlayer())}
            editingMember={status.editingMember}
          />
        )}
      </Outside>
      <Inside>
        {lineups[status.lineupNum]?.starting &&
          lineups[status.lineupNum].starting.map((starting, index) => {
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
                    lineupsActions.setEditingPlayer({
                      _id: starting?._id || null,
                      list: "starting",
                      zone: index + 1,
                    })
                  )
                }
                onSwitchClick={() =>
                  dispatch(lineupsActions.setOptionMode("substitutes"))
                }
                onCrossClick={() =>
                  dispatch(lineupsActions.removeEditingPlayer())
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
