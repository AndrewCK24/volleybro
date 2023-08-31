import { Link } from "react-router-dom";

import { Title } from "./Team";
import { CardContainer } from "../components/team/MemberCard";

const TeamListPage = () => {
  return (
    <>
      <Title>隊伍列表</Title>
      <CardContainer></CardContainer>
      <p>沒看到你的隊伍嗎？</p>
      <p>
        請聯絡你的隊伍管理者，或是<Link to="new">按此新增隊伍</Link>。
      </p>
    </>
  );
};

export default TeamListPage;
