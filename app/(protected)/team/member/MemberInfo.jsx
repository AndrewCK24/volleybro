"use client";
import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import {
  ListHeader,
  ListTitle,
  ListBtnContainer,
  ListBtn,
} from "@/app/components/common/List";
import MemberForm from "./MemberForm";
import MemberView from "./MemberView";

const MemberInfo = ({ member }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => setIsEditing(true);

  return (
    <>
      <ListHeader>
        <ListTitle>隊員詳細資料</ListTitle>
        <ListBtnContainer>
          {!isEditing && (
            <ListBtn onClick={handleEdit}>
              <FiEdit2 />
            </ListBtn>
          )}
        </ListBtnContainer>
      </ListHeader>
      {isEditing ? (
        <MemberForm member={member} setIsEditing={setIsEditing} />
      ) : (
        <MemberView member={member} />
      )}
    </>
  );
};

export default MemberInfo;
