"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { userActions } from "../user/user-slice";
import { teamActions } from "./team-slice";
import { Section } from "../../components/common/Section";
import {
  FormContainer,
  FormControl,
  FormButton,
} from "../../components/common/Form";

const TeamForm = ({ teamData, setIsEditing }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const teamId = teamData?._id;

  const [nameValue, setNameValue] = useState("");
  const [nameError, setNameError] = useState(teamId ? "" : " ");
  const [nicknameValue, setNicknameValue] = useState("");
  const [nicknameError, setNicknameError] = useState(teamId ? "" : " ");
  const errorArr = [nameError, nicknameError];

  const handleNameChange = (value) => {
    setNameValue(value);
    if (value.length === 0) {
      setNameError("隊伍名稱不得為空");
    } else {
      setNameError("");
    }
  };
  const handleNicknameChange = (value) => {
    setNicknameValue(value);
    if (value.length === 0) {
      setNicknameError("隊伍簡稱不得為空");
    } else if (value.length > 8) {
      setNicknameError("隊伍簡稱不得超過8字");
    } else {
      setNicknameError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/teams", {
        method: teamId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId,
          name: nameValue,
          nickname: nicknameValue,
        }),
      });

      const { userData, teamData, membersData } = await res.json();
      dispatch(userActions.setUser(userData));
      dispatch(teamActions.setTeam({ userData, teamData, membersData }));
      teamId ? setIsEditing(false) : router.push(`/team`);
    } catch (err) {
      console.log(err);
      setNameError("發生未知錯誤，請稍後再試");
    }
  };

  return (
    <Section>
      <FormContainer onSubmit={handleSubmit}>
        <FormControl
          name="name"
          labelText="隊伍名稱"
          type="text"
          defaultValue={teamId ? teamData.name : ""}
          placeholder="請輸入隊伍全名"
          required
          onChange={handleNameChange}
          autoComplete="off"
          warn={nameError}
        />
        <FormControl
          name="nickname"
          labelText="隊伍簡稱"
          type="text"
          defaultValue={teamId ? teamData.nickname : ""}
          placeholder="請輸入隊伍簡稱 (8字以內)"
          required
          onChange={handleNicknameChange}
          autoComplete="off"
          warn={nicknameError}
        />
        <FormButton errorArr={errorArr}>
          {teamId ? "儲存修改" : "建立隊伍"}
        </FormButton>
      </FormContainer>
      {teamId ? (
        <FormButton type="text" onClick={() => setIsEditing(false)}>
          取消編輯
        </FormButton>
      ) : (
        <FormButton type="text" onClick={() => router.push("/team")}>
          取消建立
        </FormButton>
      )}
    </Section>
  );
};

export default TeamForm;
