"use client";
import { useDispatch, useSelector } from "react-redux";
import { GiWhistle } from "react-icons/gi";
import { matchActions } from "./match-slice";
import {
  Court,
  Outside,
  Inside,
  PlayerCard,
  AdjustButton,
} from "../../components/custom/Court";

const MatchCourt = () => {
  const dispatch = useDispatch();
  const { player } = useSelector((state) => state.match.recording.ours);
  const { members } = useSelector((state) => state.team);
  const { setNum } = useSelector((state) => state.match.status.editingData);
  const { starters, liberos } = useSelector(
    (state) => state.match.sets[setNum].lineup.ours
  );

  const handleClick = (player, zone) => {
    dispatch(matchActions.setRecordingPlayer({ player, zone }));
  };
  return (
    <Court>
      <Outside className="left">
        <AdjustButton>
          <GiWhistle />
        </AdjustButton>
        {liberos.map((libero, index) => {
          const arr = libero.inOutArr;
          const liberoId =
            (arr[0] === null) === (arr[1] === null)
              ? libero.starting
              : libero.substitute;
          const member = members.find((m) => m._id === liberoId);
          return (
            <PlayerCard
              key={index}
              // onClick={() => handleClick(member, index + 7)}
              className={player === member?._id && "toggled"}
            >
              <h3>{member?.number}</h3>
              <span>{libero?.position}</span>
            </PlayerCard>
          );
        })}
      </Outside>
      <Inside>
        {starters.map((starter, index) => {
          const arr = starter.inOutArr;
          const starterId =
            (arr[0] === null) === (arr[1] === null)
              ? starter.starting
              : starter.substitute;
          const member = members.find((m) => m._id === starterId);
          return (
            <PlayerCard
              key={index}
              style={{ gridArea: `z${index + 1}` }}
              onClick={() => handleClick(member, index + 1)}
              className={player === member?._id && "toggled"}
            >
              <h3>{member?.number}</h3>
              <span>{starter.position}</span>
            </PlayerCard>
          );
        })}
      </Inside>
      <Outside className="right" />
    </Court>
  );
};

export default MatchCourt;
