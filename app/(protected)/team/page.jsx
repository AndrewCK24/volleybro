"use client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { BsGrid3X2Gap } from "react-icons/bs";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBtnGroup,
} from "@/components/ui/card";
import TeamMembers from "./TeamMembers";

const TeamPage = () => {
  const router = useRouter();
  const { name: teamName } = useSelector((state) => state.team);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle onClick={() => router.push("/team/info")}>
          {teamName}
          <FiChevronRight />
        </CardTitle>
        <CardBtnGroup>
          <Link variant="ghost" size="icon" href="/team/lineup">
            <BsGrid3X2Gap />
          </Link>
        </CardBtnGroup>
      </CardHeader>
      <TeamMembers />
    </Card>
  );
};

export default TeamPage;
