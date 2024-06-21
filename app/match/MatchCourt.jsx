"use client";
import { useDispatch, useSelector } from "react-redux";
import { GiWhistle } from "react-icons/gi";
import { matchActions } from "../store/match-slice";
import {
  Court,
  Outside,
  Inside,
  PlayerCard,
  AdjustButton,
} from "@/components/custom/court";

const MatchCourt = () => {
  const dispatch = useDispatch();
  const { recording } = useSelector((state) => state.match);
  const { members } = useSelector((state) => state.team);
  const { setNum } = useSelector((state) => state.match.status.editingData);
  const { starting, liberos } = useSelector(
    (state) => state.match.sets[setNum].lineup.ours
  );

  return (
    <Court>
      <Outside className="left">
        <AdjustButton>
          <GiWhistle />
        </AdjustButton>
        {liberos.map((libero, index) => {
          const member = members.find((m) => m._id === libero.starting);
          // FIXME: starting 只是暫時防止錯誤顯示
          return (
            <PlayerCard
              key={index}
              member={member}
              list="liberos"
              zone={index + 1}
              onCardClick={() =>
                dispatch(
                  matchActions.setRecordingPlayer({
                    _id: member?._id || null,
                    list: "liberos",
                    zone: index + 1,
                  })
                )
              }
              // FIXME: 須重新檢視 setRecordingPlayer 的邏輯與 recordingPlayer 的資料結構
              // FIXME: 須重新檢視 editingPlayer 的用詞
              editingMember={recording}
            />
          );
        })}
      </Outside>
      <Inside>
        {starting.map((starting, index) => {
          const member = members.find((m) => m._id === starting.starting);
          return (
            <PlayerCard
              key={index}
              member={member}
              list="starting"
              zone={index + 1}
              onCardClick={() =>
                dispatch(
                  matchActions.setRecordingPlayer({
                    _id: member?._id || null,
                    list: "starting",
                    zone: index + 1,
                  })
                )
              }
              onSwitchClick={() =>
                dispatch(teamActions.setOptionMode("substitutes"))
              }
              editingMember={recording}
            />
          );
        })}
      </Inside>
    </Court>
  );
};

export default MatchCourt;
