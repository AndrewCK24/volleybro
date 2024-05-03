import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Invitations from "./Invitations";

const InvitationsPage = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>隊伍邀請</CardTitle>
      </CardHeader>
      <Invitations />
    </Card>
  );
};

export default InvitationsPage;
