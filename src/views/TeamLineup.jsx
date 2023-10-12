import { useSelector } from "react-redux";
import styled from "@emotion/styled";

import store from "../store";
import { Court } from "../components/common/Court";
import {
  ListContainer,
  ListHeader,
  ListInfoGroup,
  ListTitle,
  ListItemContainer,
  StyledListItemContainer,
  ListItemContent,
} from "../components/common/List";

const FixedListContainer = styled(ListContainer)`
  flex: 1 1;
  overflow: scroll;
  overscroll-behavior-y: contain;
`;

const TransparentContainer = styled(ListContainer)`
  padding-top: 0;
  background-color: transparent;
  box-shadow: none;
`;

const SaveBtn = styled(StyledListItemContainer)`
  justify-content: center;
  background-color: var(--color-secondary-500);
  color: var(--color-primary-100);
`;

const TeamLineupPage = () => {
  const { members } = useSelector((state) => state.team);

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListInfoGroup>
            <ListTitle>選擇先發球員</ListTitle>
          </ListInfoGroup>
        </ListHeader>
        <Court members={members} />
      </ListContainer>
      <FixedListContainer>
        {members.map(
          (member, index) =>
            member._id && (
              <ListItemContainer key={index} disabled={false}>
                <ListItemContent className="bold">
                  {member.number}
                </ListItemContent>
                <ListItemContent>{member.role}</ListItemContent>
                <ListItemContent className="extend">
                  {member.name}
                </ListItemContent>
              </ListItemContainer>
            )
        )}
      </FixedListContainer>
      <TransparentContainer>
        <SaveBtn>儲存陣容</SaveBtn>
      </TransparentContainer>
    </>
  );
};

export default TeamLineupPage;

export const loader = () => {
  store.dispatch({ type: "root/setTitle", payload: "預設陣容" });
  return null;
};
