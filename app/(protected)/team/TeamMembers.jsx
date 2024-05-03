"use client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { FiUser, FiPlus } from "react-icons/fi";
import { Link } from "@/components/ui/button";
import {
  ListItem,
  ListItemText,
  ListIndicator,
} from "@/app/components/common/List";

const TeamMembers = () => {
  const router = useRouter();
  const { members } = useSelector((state) => state.team);

  return (
    <>
      {members.map((member) => (
        <ListItem
          key={member._id}
          onClick={() => router.push(`/team/member/${member._id}`)}
        >
          <FiUser />
          <ListItemText minimized={true} bold={true}>
            {member.number || "??"}
          </ListItemText>
          <ListItemText>{member.name}</ListItemText>
          <ListIndicator member={member} />
        </ListItem>
      ))}
      <Link variant="secondary" size="lg" href="/team/member/new">
        <FiPlus />
      </Link>
    </>
  );
};

export default TeamMembers;
