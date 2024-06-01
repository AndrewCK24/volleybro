import { signOut } from "@/auth";
import { FiLogOut } from "react-icons/fi";
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
          await signOut();
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
