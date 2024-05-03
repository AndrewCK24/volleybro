"use client";
import { useDispatch } from "react-redux";
import { userActions } from "../user/user-slice";
import { teamActions } from "../team/team-slice";
import { FiLogOut } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Menu from "./Menu";

const userPage = () => {
  const dispatch = useDispatch();
  const handleSignOut = async () => {
    try {
      await fetch("/api/sign-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
      dispatch(userActions.signOut());
      dispatch(teamActions.resetTeam());
      router.push("/sign-in");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Card className="w-full">
        <Menu />
      </Card>
      <Card className="w-full py-0 bg-transparent shadow-none">
        <Button variant="destructive" size="lg" onClick={handleSignOut}>
          <FiLogOut />
          登出
        </Button>
      </Card>
    </>
  );
};

export default userPage;
