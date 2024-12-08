import { signOut } from "@/auth";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import Menu from "@/components/user/menu";

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
          <RiLogoutBoxRLine />
          登出
        </Button>
      </form>
    </>
  );
};

export default UserPage;
