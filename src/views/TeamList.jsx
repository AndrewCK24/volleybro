import { Link } from "react-router-dom";

import store from "../store";
import {
  ListContainer,
  ListHeader,
  ListTitle,
  ListItemContainer,
  ListItem,
} from "../components/common/List";

const TeamListPage = () => {
  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListTitle>已加入的隊伍</ListTitle>
        </ListHeader>
        <ListItemContainer>
          <ListItem>台大日文戲劇男排</ListItem>
          <ListItem>台大日文戲劇男排</ListItem>
          <ListItem>台大日文戲劇男排</ListItem>
        </ListItemContainer>
      </ListContainer>
      <ListContainer>
        <ListHeader>
          <ListTitle>已受邀的隊伍</ListTitle>
        </ListHeader>
      </ListContainer>
      <p>沒看到你的隊伍嗎？</p>
      <p>
        請聯絡你的隊伍管理者，或是<Link to="/team/new">按此新增隊伍</Link>。
      </p>
    </>
  );
};

export default TeamListPage;

export const loader = () => {
  store.dispatch({ type: "root/setTitle", payload: "隊伍列表" });
  return null;
};
