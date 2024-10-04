import { signOut } from "@/auth";
import { FiLogOut } from "react-icons/fi";
import { Button } from "@/src/components/ui/button";
import Menu from "@/src/components/user/menu";

const UserPage = () => {
  return (
    <>
      <Menu className="w-full" />
      <form
        className="grid w-full px-4"
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/auth/sign-in" });
        }}
      >
        <Button variant="destructive" size="lg">
          <FiLogOut />
          登出
        </Button>
      </form>
    </>
  );
};

export default UserPage;
