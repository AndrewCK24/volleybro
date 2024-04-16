"use client";
import { useSelector } from "react-redux";
import { Section } from "@/app/components/common/Section";
import MemberInfo from "../MemberInfo";

const MemberPage = ({ params }) => {
  const { id } = params;
  const { members } = useSelector((state) => state.team);
  const member = members.find((member) => member._id === id);

  return (
    <Section>
      <MemberInfo member={member} />
    </Section>
  );
};

export default MemberPage;
