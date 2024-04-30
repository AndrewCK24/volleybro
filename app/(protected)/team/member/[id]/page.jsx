"use client";
import { useSelector } from "react-redux";
import { FiEdit2 } from "react-icons/fi";
import { Link } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBtnGroup,
} from "@/components/ui/card";
import MemberInfo from "../MemberInfo";

const MemberPage = ({ params }) => {
  const { id: memberId } = params;
  const { members } = useSelector((state) => state.team);
  const member = members.find((member) => member._id === memberId);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>隊員詳細資料</CardTitle>
        <CardBtnGroup>
          <Link variant="link" size="lg" href={`/team/member/${memberId}/edit`}>
            <FiEdit2 /> 編輯
          </Link>
        </CardBtnGroup>
      </CardHeader>
      <MemberInfo member={member} />
    </Card>
  );
};

export default MemberPage;
