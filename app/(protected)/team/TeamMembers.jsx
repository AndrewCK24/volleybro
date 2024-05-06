"use client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  FiUser,
  FiPlus,
  FiShield,
  FiClock,
  FiCheckCircle,
  FiXCircle
} from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/components/ui/button";
import { ListItem, ListItemText } from "@/app/components/common/List";

const TeamMembers = () => {
  const router = useRouter();
  const { members } = useSelector((state) => state.team);

  return (
    <>
      {members.map((member) => {
        const { admin, user_id, email } = member.meta;
        const identity = !email
          ? {
              text: "未邀請",
              type: "secondary",
              icon: <FiXCircle />,
            }
          : !user_id
          ? {
              text: "邀請中",
              type: "outline",
              icon: <FiClock />,
            }
          : !admin
          ? {
              text: "已加入",
              type: "default",
              icon: <FiCheckCircle />,
            }
          : {
              text: "管理者",
              type: "destructive",
              icon: <FiShield />,
            };

        return (
          <ListItem
            key={member._id}
            onClick={() => router.push(`/team/member/${member._id}`)}
          >
            <FiUser />
            <ListItemText minimized={true} bold={true}>
              {member.number || "??"}
            </ListItemText>
            <ListItemText>{member.name}</ListItemText>
            <Badge variant={identity.type} className="!svg-[1rem]">
              {identity.icon} {identity.text}
            </Badge>
          </ListItem>
        );
      })}
      <Link variant="secondary" size="lg" href="/team/member/new">
        <FiPlus />
      </Link>
    </>
  );
};

export default TeamMembers;
