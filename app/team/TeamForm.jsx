"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { userActions } from "../user/user-slice";
import { Section } from "../components/common/Section";
import {
  FormContainer,
  FormContents,
  FormControl,
  FormButton,
} from "../components/common/Form";

const TeamForm = ({ isNew }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const actionPath = isNew ? "/api/team" : "/api/team/:id";
  const teamData = isNew ? {} : useSelector((state) => state.team);

  const [nameValue, setNameValue] = useState("");
  const [nameError, setNameError] = useState(isNew ? " " : "");
  const [nicknameValue, setNicknameValue] = useState("");
  const [nicknameError, setNicknameError] = useState(isNew ? " " : "");
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
    const formData = { name: nameValue, nickname: nicknameValue };
    try {
      const res = await fetch(actionPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const { userData, teamData, membersData } = await res.json();
      console.log("userData", userData);
      console.log("teamData", teamData);
      console.log("membersData", membersData);
      dispatch(userActions.setUser(userData));
      router.push(`/team`);
    } catch (err) {
      console.log(err);
      setNameError("發生未知錯誤，請稍後再試");
    }
  };

  return (
    <Section className="fixed">
      <FormContainer>
        <FormContents onSubmit={handleSubmit}>
          <FormControl
            name="name"
            labelText="隊伍名稱"
            type="text"
            defaultValue={isNew ? "" : teamData.name}
            placeholder="請輸入隊伍全名"
            required={true}
            onChange={handleNameChange}
            autoComplete="off"
            warn={nameError}
          />
          <FormControl
            name="nickname"
            labelText="隊伍簡稱"
            type="text"
            defaultValue={isNew ? "" : teamData.nickname}
            placeholder="請輸入隊伍簡稱 (8字以內)"
            required={true}
            onChange={handleNicknameChange}
            autoComplete="off"
            warn={nicknameError}
          />
          <FormButton errorArr={errorArr}>
            {isNew ? "建立隊伍" : "儲存修改"}
          </FormButton>
        </FormContents>
      </FormContainer>
    </Section>
  );
};

export default TeamForm;
