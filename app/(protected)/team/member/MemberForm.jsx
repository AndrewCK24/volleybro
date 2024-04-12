"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { teamActions } from "../team-slice";
import { SectionHr } from "@/app/components/common/Section";
import {
  FormContainer,
  FormControl,
  FormSelect,
  FormButton,
} from "@/app/components/common/Form";

const MemberForm = ({ member = null, setIsEditing }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const [numberValue, setNumberValue] = useState(member?.number || null);
  const [numberError, setNumberError] = useState(member ? "" : " ");
  const [nameValue, setNameValue] = useState(member?.name || "");
  const [nameError, setNameError] = useState(member ? "" : " ");
  const [positionValue, setPositionValue] = useState(member?.position || "");
  const [emailValue, setEmailValue] = useState(member?.meta.email || "");
  const [emailError, setEmailError] = useState("");
  const [adminValue, setAdminValue] = useState(member?.meta.admin || false);
  const errorArr = [numberError, nameError, emailError];
  const teamId = useSelector((state) => state.team._id);
  const isAdmin = useSelector((state) => state.team.admin);

  const handleNumberChange = (value) => {
    setNumberValue(value);
    if (value.length === 0) {
      setNumberError("背號不得為空");
    } else {
      setNumberError("");
    }
  };

  const handleNameChange = (value) => {
    setNameValue(value);
    if (value.length === 0) {
      setNameError("姓名不得為空");
    } else {
      setNameError("");
    }
  };

  const handlePositionChange = (value) => setPositionValue(value);

  const handleEmailChange = (value) => {
    setEmailValue(value);
    const validEmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (value.length === 0) return setEmailError("");
    if (!value.match(validEmailRegex)) {
      setEmailError("請輸入有效的 email");
    } else {
      setEmailError("");
    }
  };

  const handleAdminChange = (value) => setAdminValue(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      team_id: teamId,
      meta: { email: emailValue, admin: adminValue },
      number: numberValue,
      name: nameValue,
      position: positionValue,
      _id: member?._id || null,
    };
    const isEditing = formData._id;

    try {
      const response = await fetch("/api/members", {
        method: isEditing ? "PUT" : "POST", // PUT for update, POST for create
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const { teamData, membersData, member } = await response.json();

      dispatch(
        teamActions.setTeam({ userData: userState, teamData, membersData })
      );
      if (isEditing) {
        setIsEditing(false);
      } else {
        router.push(`/team/member/${member._id}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <FormContainer onSubmit={handleSubmit}>
        <FormControl
          name="number"
          labelText="背號"
          type="number"
          defaultValue={member?.number || ""}
          placeholder="請輸入背號"
          required
          onChange={handleNumberChange}
          autoComplete="off"
          warn={numberError}
        />
        <FormControl
          name="name"
          labelText="姓名"
          type="text"
          defaultValue={member?.name || ""}
          placeholder="請輸入姓名"
          required
          onChange={handleNameChange}
          autoComplete="off"
          warn={nameError}
        />
        <FormSelect
          name="position"
          labelText="位置"
          options={[
            { id: "S", value: "S", text: "舉球" },
            { id: "OH", value: "OH", text: "主攻" },
            { id: "MB", value: "MB", text: "攔中" },
            { id: "OP", value: "OPP", text: "副攻" },
            { id: "L", value: "L", text: "自由" },
          ]}
          defaultValue={member?.position || ""}
          onChange={handlePositionChange}
        />
        <SectionHr content="權限與邀請" />
        <FormControl
          name="email"
          labelText="信箱"
          type="email"
          defaultValue={member?.meta.email || ""}
          placeholder="請輸入信箱"
          disabled={member && member.meta.email && !isAdmin}
          onChange={handleEmailChange}
          warn={emailError}
        />
        {isAdmin && (
          <FormSelect
            name="admin"
            labelText="權限"
            options={[
              { id: "member", value: false, text: "一般成員" },
              { id: "admin", value: true, text: "管理者" },
            ]}
            defaultValue={member?.meta.admin || false}
            onChange={handleAdminChange}
          />
        )}
        <SectionHr content="" />
        <FormButton errorArr={errorArr}>
          {member ? "儲存變更" : "建立隊員"}
        </FormButton>
      </FormContainer>
      {member ? (
        <FormButton type="text" onClick={() => setIsEditing(false)}>
          取消編輯
        </FormButton>
      ) : (
        <FormButton type="text" onClick={() => router.push("/team")}>
          返回隊員列表
        </FormButton>
      )}
    </>
  );
};

export default MemberForm;
