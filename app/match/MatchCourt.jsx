"use client";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { GiWhistle } from "react-icons/gi";
import {
  FiUser,
  FiInfo,
  FiHelpCircle,
  FiRepeat,
  FiRotateCw,
} from "react-icons/fi";
import { matchActions } from "./match-slice";
import {
  CourtContainer,
  Outside,
  Inside,
  PlayerCard,
} from "../components/common/Court";

const MultiFunctionButton = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1.3;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: 0.25rem solid var(--primary-100);
  border-radius: 0.5rem;
  color: var(--primary-100);
  gap: 0.5rem;
  svg {
    width: 80%;
    height: auto;
    color: var(--secondary-300);
  }
  svg:first-child {
    position: absolute;
    bottom: 0;
    right: 10%;
    width: 40%;
    height: auto;
    z-index: 1;
    color: var(--primary-100);
  }
`;

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
    <CourtContainer>
      <Outside className="left">
        <MultiFunctionButton>
          <GiWhistle />
          <FiUser />
        </MultiFunctionButton>
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
              className={player.number === member?.number && "toggled"}
            >
              <h3>{member?.number}</h3>
              <span>L</span>
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
              className={player.number === member?.number && "toggled"}
            >
              <h3>{member?.number}</h3>
              <span>{starter.position}</span>
            </PlayerCard>
          );
        })}
      </Inside>
      <Outside className="right" />
    </CourtContainer>
  );
};

export default MatchCourt;
