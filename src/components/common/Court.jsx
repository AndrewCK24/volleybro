import styled from "@emotion/styled";

const CourtContainer = styled.div`
  width: 100%;
  aspect-ratio: 12.5 / 9;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  background-color: var(--color-secondary-500);
  padding: 0.5rem;
`;

const OutsideZone = styled.div`
  flex: 1.75;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border: 0.25rem solid transparent;
`;

const AttackLine = styled.div`
  position: relative;
  top: 0%;
  width: 100%;
  height: 33%;
  background-color: var(--color-danger-500);
  border-bottom: 0.25rem solid var(--color-primary-100);
  z-index: 1;
`;

const SideAttackLine = styled(AttackLine)`
  background-color: transparent;
  border-bottom: 0.25rem dashed var(--color-primary-100);
`;

const InsideZone = styled.div`
  flex: 9;
  aspect-ratio: 1 / 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: var(--color-danger-400);
  border: 0.25rem solid var(--color-primary-100);
  position: relative;
`;

const MainZone = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 10% 1rem;
  display: grid;
  grid-template-areas:
    "p4 p3 p2"
    "p5 p6 p1";
  grid-column-gap: 1rem;
  grid-row-gap: 10%;
  z-index: 1;
`;

const Dock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  border: 0.25rem solid var(--color-primary-100);
  background-color: var(--color-primary-300);
  opacity: 0.5;
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-primary-100);
`;

export const Court = ({ members }) => {
  const positionArr = ["p1", "p2", "p3", "p4", "p5", "p6"];

  return (
    <CourtContainer>
      <OutsideZone>
        <SideAttackLine />
        <Dock>替補</Dock>
      </OutsideZone>
      <InsideZone>
        <AttackLine />
        <MainZone>
          {positionArr.map((position, index) => (
            <Dock key={index} style={{gridArea: position}}>
              {index + 1}
            </Dock>
          ))}
        </MainZone>
      </InsideZone>
      <OutsideZone>
        <SideAttackLine />
      </OutsideZone>
    </CourtContainer>
  );
};
