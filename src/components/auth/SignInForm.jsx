import { useState } from "react";
import { redirect } from "react-router-dom";

import store from "../../store";
import Logo from "../common/Logo";
import {
  FormContainer,
  FormTitle,
  FormContents,
  FormControl,
  FormButton,
  StyledLink,
} from "../common/Form";

const SignInForm = () => {
  const [emailError, setEmailError] = useState(" ");
  const [passwordError, setPasswordError] = useState(" ");
  const errorArr = [emailError, passwordError];

  const handleEmailChange = (value) => {
    const validEmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (value.length === 0) {
      setEmailError("帳號不得為空");
    } else if (!value.match(validEmailRegex)) {
      setEmailError("請輸入有效的 email");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (value) => {
    if (value.length === 0) {
      setPasswordError("密碼不得為空");
    } else if (value.length > 20) {
      setPasswordError("密碼不得超過20字");
    } else {
      setPasswordError("");
    }
  };

  return (
    <FormContainer method="post">
      <Logo />
      <FormTitle>歡迎使用 V-Stats</FormTitle>
      <FormContents>
        <FormControl
          name="email"
          labelText="帳號"
          type="email"
          placeholder="請輸入 email"
          required={true}
          onChange={handleEmailChange}
          warn={emailError}
        />
        <FormControl
          name="password"
          labelText="密碼"
          type="password"
          placeholder="請輸入密碼"
          required={true}
          onChange={handlePasswordChange}
          warn={passwordError}
        />
        <StyledLink to="/auth/password">忘記密碼？</StyledLink>
      </FormContents>
      <FormButton errorArr={errorArr}>註冊 / 登入</FormButton>
    </FormContainer>
  );
};

export default SignInForm;

export const action = async ({ request }) => {
  const formData = await request.formData();
  const reqData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    // TODO: fetch-user-by-form 應檢討改名，因其除返回 userData 外，也返回 teamData
    const response = await fetch("/.netlify/functions/fetch-user-by-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(reqData),
    });
    const { status, userData, teamData } = await response.json();
    console.log("auth action finished", userData);

    // TODO: 新增密碼錯誤提示 (401)，可能需搭配新的 redux state
    if (status === 200) {
      store.dispatch({ type: "user/loadUserData", payload: userData });
      store.dispatch({ type: "team/loadTeamData", payload: teamData });
      return redirect("/");
    } else if (status === 201) {
      store.dispatch({ type: "user/loadUserData", payload: userData });
      return redirect("/team/new");
    } else if (status === 210) {
      store.dispatch({ type: "user/startSignUp", payload: reqData });
      return redirect("/auth/sign-up");
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
