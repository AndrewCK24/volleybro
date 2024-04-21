import styled from "styled-components";
import { FiPlus, FiX, FiRepeat } from "react-icons/fi";

export const CourtContainer = styled.div`
  width: 100%;
  max-height: 35vh;
  aspect-ratio: 11 / 9;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  background-color: var(--secondary-500);
  padding: 0.5rem;
`;

export const Outside = styled.div`
  position: relative;
  height: 100%;
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-gap: 0.5rem;
  border: 0.25rem solid transparent;
  border-left: 0;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    width: 100%;
    min-height: calc((100% - 1rem) / 3);
    border-bottom: 0.25rem dashed var(--primary-100);
  }
  &.inner {
    padding-right: 0.25rem;
    flex: 2;
  }
  &.outer {
    // TODO: 目前手機版未使用，未來需注意其他螢幕大小的排版
    display: flex;
    flex: 0.5 10 0;
  }
`;

export const Inside = styled.div`
  position: relative;
  flex: 9;
  aspect-ratio: 1 / 1;
  height: 100%;
  padding: 5% 0.5rem;
  display: grid;
  grid-template-areas:
    "z4 z3 z2"
    "z5 z6 z1";
  grid-gap: 0.5rem;
  background-color: var(--danger-400);
  border: 0.25rem solid var(--primary-100);
  &::before {
    content: "";
    position: absolute;
    top: 0;
    width: 100%;
    min-height: calc((100% - 1rem) / 3);
    background-color: var(--danger-500);
    border-bottom: 0.25rem solid var(--primary-100);
  }
`;

export const PlayerCardContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 0.5rem;
  border: 0.25rem solid var(--primary-100);
  background-color: var(--primary-100);
  transition: all 0.2s ease-in-out;
  z-index: 1;
  p {
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: 3rem;
    min-height: 3rem;
    max-width: 3rem;
    min-width: 3rem;
    font-size: 3rem;
    font-weight: 700;
    svg {
      font-size: 3rem;
    }
  }
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: 1.25rem;
    min-height: 1.25rem;
    max-width: 1.25rem;
    min-width: 1.25rem;
    font-size: 1.25rem;
    font-weight: 400;
    svg {
      font-size: 1.25rem;
    }
  }
  &.empty {
    opacity: 50%;
    svg {
      opacity: 100%;
      color: var(--primary-500);
      font-size: 4rem;
    }
  }
  &.toggled {
    background-color: var(--secondary-500);
    color: var(--primary-100);
  }
`;

export const Button = styled.div`
  position: absolute;
  width: 1.5rem;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.25rem;
  border: 0.125rem solid var(--primary-100);
  border-radius: 50%;
  color: var(--primary-100);
  font-size: 1.25rem;
  transition: all 0.2s ease-in-out;
  &.left {
    top: -0.75rem;
    left: -0.75rem;
    background-color: var(--secondary-500);
  }
  &.right {
    top: -0.75rem;
    right: -0.75rem;
    background-color: var(--danger-500);
  }
`;

export const PlayerCard = ({
  member,
  list,
  zone,
  onCardClick,
  onSwitchClick,
  onCrossClick,
  editingMember,
}) => {
  const toggled = editingMember.list === list && editingMember.zone === zone;
  return (
    <PlayerCardContainer
      style={list === "starting" ? { gridArea: `z${zone}` } : {}}
      className={`${toggled && "toggled"} ${member || "empty"}`}
      onClick={(e) => {
        e.stopPropagation();
        onCardClick();
      }}
    >
      {member ? (
        <>
          <p>{member.number}</p>
          <span>{member.position}</span>
          {toggled && (
            <>
              <Button
                className="left"
                onClick={(e) => {
                  e.stopPropagation();
                  onSwitchClick();
                }}
              >
                <FiRepeat />
              </Button>
              {onCrossClick && (
                <Button
                  className="right"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCrossClick();
                  }}
                >
                  <FiX />
                </Button>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <p>
            <FiPlus />
          </p>
          <span />
        </>
      )}
    </PlayerCardContainer>
  );
};

export const AdjustButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--primary-100);
  gap: 0.25rem;
  z-index: 1;
  cursor: pointer;
  svg {
    width: 2.5rem;
    height: 2.5rem;
  }
`;
