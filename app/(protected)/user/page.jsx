"use client";
import { signOut } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Menu from "./Menu";

const UserPage = () => {
  return (
    <>
      <Card className="w-full">
        <Menu />
      </Card>
      <Card className="w-full py-0 bg-transparent shadow-none">
        <Button variant="destructive" size="lg" onClick={() => signOut()}>
          <FiLogOut />
          登出
        </Button>
      </Card>
    </>
  );
};

export default UserPage;
