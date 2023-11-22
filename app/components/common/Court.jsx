import styled from "styled-components";

export const CourtContainer = styled.div`
  width: 100%;
  aspect-ratio: 12.5 / 9;
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
  flex: 1.75;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border: 0.25rem solid transparent;
`;

const AttackLine = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 33%;
  min-height: 33%;
  background-color: var(--danger-500);
  border-bottom: 0.25rem solid var(--primary-100);
`;

export const OutsideFront = styled(AttackLine)`
  background-color: transparent;
  border-bottom: 0.25rem dashed var(--primary-100);
`;

const Inside = styled.div`
  position: relative;
  flex: 9;
  aspect-ratio: 1 / 1;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: var(--danger-400);
  border: 0.25rem solid var(--primary-100);
`;

const MainZone = styled.div`
  flex: 1 1;
  max-width: calc((100vw - 3rem) * (9 / 12.5));
  height: 100%;
  padding: 5% 0.5rem;
  display: grid;
  grid-template-areas:
    "z4 z3 z2"
    "z5 z6 z1";
  grid-column-gap: 0.25rem;
  grid-row-gap: 0.25rem;
  z-index: 1;
`;

export const PlayerCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  border: 0.25rem solid var(--primary-100);
  background-color: var(--primary-100);
  h3 {
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: 4rem;
    min-height: 4rem;
    max-width: 4rem;
    min-width: 4rem;
    font-size: 4rem;
    font-weight: 700;
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
  }
  &:empty {
    opacity: 0.5;
    background-color: var(--primary-300);
    &::before {
      content: "";
      display: flex;
      align-items: center;
      justify-content: center;
      max-height: 4rem;
      min-height: 4rem;
      max-width: 4rem;
      min-width: 4rem;
      font-size: 4rem;
    }
    &::after {
      content: "";
      display: flex;
      align-items: center;
      justify-content: center;
      max-height: 1.5rem;
      min-height: 1.5rem;
      max-width: 1.5rem;
      min-width: 1.5rem;
      font-size: 1.5rem;
    }
  }
  &.toggled {
    color: var(--secondary-500);
    border-color: var(--secondary-500);
    &:empty {
      opacity: 0.9;
    }
  }
`;

export const InsideCourt = ({ children }) => {
  return (
    <Inside>
      <AttackLine />
      <MainZone>{children}</MainZone>
    </Inside>
  );
};

export const Court = ({ starters }) => {
  return (
    <CourtContainer>
      <Outside>
        <OutsideFront />
        <PlayerCard>L</PlayerCard>
      </Outside>
      <Inside>
        <AttackLine />
        <MainZone>
          {starters.map((starter, index) => (
            <PlayerCard
              key={index}
              style={{ gridArea: `z${index + 1}` }}
              content={index + 1}
            >
              {/* {index + 1} */}
            </PlayerCard>
          ))}
        </MainZone>
      </Inside>
      <Outside>
        <OutsideFront />
      </Outside>
    </CourtContainer>
  );
};
