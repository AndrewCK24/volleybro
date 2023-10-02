import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { rootActions } from "../components/root/root-slice";
import {
  ListContainer,
  ListHeader,
  ListTitle,
} from "../components/common/List";

const TeamListPage = () => {
  const dispatch = useDispatch();
  dispatch(rootActions.setTitle("隊伍列表"));

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListTitle>已加入的隊伍</ListTitle>
        </ListHeader>
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
