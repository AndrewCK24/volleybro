"use client";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import MemberForm from "../../MemberForm";
import { teamActions } from "../../../team-slice";

const EditMemberPage = ({ params }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { memberId } = params;
  const user = useSelector((state) => state.user);
  const { _id: teamId } = useSelector((state) => state.team);
  const member = useSelector((state) =>
    state.team.members.find((member) => member._id === memberId)
  );

  const onSubmit = async (formData) => {
    formData.teamId = teamId;
    try {
      const res = await fetch(`/api/members/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const { teamData, membersData } = await res.json();
      dispatch(teamActions.setTeam({ userData: user, teamData, membersData }));
      return router.push(`/team/member/${memberId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>編輯隊員資訊</CardTitle>
      </CardHeader>
      <MemberForm member={member} onSubmit={onSubmit} />
    </Card>
  );
};

export default EditMemberPage;
