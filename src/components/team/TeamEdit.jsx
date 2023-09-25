import { useState } from "react";
import { redirect } from "react-router-dom";

import store from "../../store";
import {
  FormContainer,
  FormTitle,
  FormContents,
  FormControl,
  FormButton,
} from "../general/Form";

const TeamCreatePage = () => {
  const [nameError, setNameError] = useState(" ");
  const [nicknameError, setNicknameError] = useState(" ");
  const errorArr = [nameError, nicknameError];

  const handleNameChange = (value) => {
    if (value.length === 0) {
      setNameError("隊伍名稱不得為空");
    } else if (value.length > 20) {
      setNameError("隊伍名稱不得超過20字");
    } else {
      setNameError("");
    }
  };

  const handleNicknameChange = (value) => {
    if (value.length === 0) {
      setNicknameError("隊伍簡稱不得為空");
    } else if (value.length > 8) {
      setNicknameError("隊伍簡稱不得超過8字");
    } else {
      setNicknameError("");
    }
  };

  return (
    <FormContainer method="post" path="/team/new">
      <FormTitle>建立隊伍</FormTitle>
      <FormContents>
        <FormControl
          name="name"
          labelText="隊伍名稱"
          type="text"
          placeholder="請輸入隊伍全名"
          required={true}
          onChange={handleNameChange}
          warn={nameError}
        />
        <FormControl
          name="nickname"
          labelText="隊伍簡稱"
          type="text"
          placeholder="請輸入隊伍簡稱 (8字以內)"
          required={true}
          onChange={handleNicknameChange}
          warn={nicknameError}
        />
      </FormContents>
      <FormButton errorArr={errorArr}>建立隊伍</FormButton>
    </FormContainer>
  );
};

export default TeamCreatePage;

export const action = async ({ request }) => {
  console.log("team create action started");
  const formData = await request.formData();
  const reqData = {
    name: formData.get("name"),
    nickname: formData.get("nickname"),
  };

  try {
    const response = await fetch("/.netlify/functions/create-team", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(reqData),
    });
    const { status, userData, teamData } = await response.json();
    console.log("team create action finished", userData);

    if (status === 200) {
      store.dispatch({ type: "user/signIn", payload: userData });
      store.dispatch({ type: "team/loadTeamData", payload: teamData });
      store.dispatch({
        type: "team/setMemberEditMode",
        payload: { index: 0, isEditing: true },
      });
      return redirect("/team");
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};