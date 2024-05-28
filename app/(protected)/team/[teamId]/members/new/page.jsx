"use client";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { teamActions } from "@/app/store/team-slice";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import MemberForm from "@/components/team/members/form";

const MemberCreatePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { _id: teamId } = useSelector((state) => state.team);

  const onSubmit = async (formData) => {
    formData.team_id = teamId;
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const { teamData, membersData, member } = await res.json();

      dispatch(teamActions.setTeam({ userData: user, teamData, membersData }));
      router.push(`/team/member/${member._id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>新增隊員</CardTitle>
      </CardHeader>
      <MemberForm onSubmit={onSubmit} />
    </Card>
  );
};

export default MemberCreatePage;
