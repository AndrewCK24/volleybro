import { CardHeader, CardTitle } from "@/components/ui/card";
import EmailForm from "@/components/team/members/access-config/email-form";
import RoleForm from "@/components/team/members/access-config/role-form";

const AccessConfig = ({ teamId, memberId }) => {
  return (
    <>
      <CardHeader className="mt-4">
        <CardTitle>邀請與權限</CardTitle>
      </CardHeader>
      <EmailForm teamId={teamId} memberId={memberId} />
      <RoleForm teamId={teamId} memberId={memberId} />
    </>
  );
};

export default AccessConfig;
