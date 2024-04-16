import styled from "styled-components";
import { FiPlus, FiX } from "react-icons/fi";

export const CourtContainer = styled.div`
  width: 100%;
  max-height: 35vh;
  aspect-ratio: 11 / 9;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  background-color: var(--secondary-500);
  padding: 0.5rem;
`;

export const Outside = styled.div`
  position: relative;
  flex: 2;
  height: 100%;
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  border: 0.25rem solid transparent;
  grid-gap: 0.5rem;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    width: 100%;
    min-height: calc((100% - 0.5rem) / 3);
    border-bottom: 0.25rem dashed var(--primary-100);
  }
  &.left {
    padding-right: 0.25rem;
  }
  &.right {
    display: none;
    @media (min-width: 768px) {
      display: flex;
      flex: 1 10 0;
    }
  }
`;

export const Inside = styled.div`
  position: relative;
  flex: 9;
  aspect-ratio: 1 / 1;
  height: 100%;
  max-width: calc((100vw - 3rem) * (9 / 11));
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
    min-height: calc((100% - 0.5rem) / 3);
    background-color: var(--danger-500);
    border-bottom: 0.25rem solid var(--primary-100);
  }
`;

export const PlayerCardContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  border: 0.25rem solid var(--primary-100);
  background-color: var(--primary-100);
  transition: all 0.2s ease-in-out;
  z-index: 1;
  p {
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: 4rem;
    min-height: 4rem;
    max-width: 4rem;
    min-width: 4rem;
    font-size: 4rem;
    font-weight: 700;
    svg {
      font-size: 4rem;
    }
  }
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: 1.5rem;
    min-height: 1.5rem;
    max-width: 1.5rem;
    min-width: 1.5rem;
    font-size: 1.5rem;
    font-weight: 400;
    svg {
      font-size: 1.5rem;
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

export const Cross = styled.div`
  position: absolute;
  top: -0.75rem;
  right: -0.75rem;
  width: 1.25rem;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.25rem;
  border: 0.125rem solid var(--primary-100);
  border-radius: 50%;
  background-color: var(--danger-500);
  color: var(--primary-100);
  font-size: 1.5rem;
  transition: all 0.2s ease-in-out;
`;

export const PlayerCard = ({
  member,
  list,
  zone,
  onCardClick,
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
          {toggled && onCrossClick && (
            <Cross
              onClick={(e) => {
                e.stopPropagation();
                onCrossClick();
              }}
            >
              <FiX />
            </Cross>
          )}
        </>
      ) : (
        <FiPlus />
      )}
    </PlayerCardContainer>
  );
};

export const AdjustButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: var(--primary-100);
  gap: 0.25rem;
  z-index: 1;
  cursor: pointer;
  svg {
    width: 3rem;
    height: 3rem;
  }
`;
