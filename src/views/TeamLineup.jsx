import { useSelector } from "react-redux";
import styled from "@emotion/styled";

import store from "../store";
import { Section } from "../components/common/Section";
import { Court } from "../components/common/Court";
import {
  ListItemContainer,
  ListItemContent,
} from "../components/common/List";

const SaveBtn = styled(ListItemContainer)`
  justify-content: center;
  background-color: var(--color-secondary-500);
  color: var(--color-primary-100);
`;

const TeamLineupPage = () => {
  const { members } = useSelector((state) => state.team);

  return (
    <>
      <Section>
        <Court members={members} />
      </Section>
      <Section className="fixed">
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
      </Section>
      <Section className="transparent">
        <SaveBtn>儲存陣容</SaveBtn>
      </Section>
    </>
  );
};

export default TeamLineupPage;

export const loader = () => {
  store.dispatch({ type: "root/setTitle", payload: "預設陣容" });
  return null;
};
