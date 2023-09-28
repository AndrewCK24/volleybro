import { useState } from "react";
import { useSelector } from "react-redux";
import { redirect } from "react-router-dom";

import store from "../../store";
import {
  FormContainer,
  FormTitle,
  FormContents,
  FormControl,
  FormButton,
  StyledLink,
} from "../general/Form";

const SignUpForm = () => {
  const { email, password } = useSelector((state) => state.user);
  const [emailError, setEmailError] = useState("");         // 預設沒有錯誤
  const [inputPassword, setInputPassword] = useState(password);
  const [passwordError, setPasswordError] = useState("");   // 預設沒有錯誤
  const [passwordConfirmError, setPasswordConfirmError] = useState(" ");
  const [nameError, setNameError] = useState(" ");
  const errorArr = [passwordError, passwordConfirmError, nameError];

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
    setInputPassword(value);
    if (value.length === 0) {
      setPasswordError("密碼不得為空");
    } else if (value.length > 20) {
      setPasswordError("密碼不得超過20字");
    } else {
      setPasswordError("");
    }
  };

  const handlePasswordConfirmChange = (value) => {
    if (value !== inputPassword) {
      setPasswordConfirmError("密碼不一致");
    } else {
      setPasswordConfirmError("");
    }
  };

  const handleNameChange = (value) => {
    if (value.length === 0) {
      setNameError("使用者名稱不得為空");
    } else if (value.length > 20) {
      setNameError("使用者名稱不得超過20字");
    } else {
      setNameError("");
    }
  }

  return (
    <FormContainer method="post" action="/auth/sign-up">
      <FormTitle>確認使用者資訊</FormTitle>
      <FormContents>
        <FormControl
          name="email"
          labelText="帳號"
          type="email"
          defaultValue={email}
          placeholder="請輸入 email"
          required={true}
          onChange={handleEmailChange}
          warn={emailError}
        />
        <FormControl
          name="password"
          labelText="密碼"
          type="password"
          defaultValue={password}
          placeholder="請輸入密碼"
          required={true}
          onChange={handlePasswordChange}
          warn={passwordError}
        />
        <FormControl
          name="passwordConfirm"
          labelText="確認密碼"
          type="password"
          placeholder="請再次輸入密碼"
          required={true}
          onChange={handlePasswordConfirmChange}
          warn={passwordConfirmError}
        />
        <FormControl
          name="name"
          labelText="姓名"
          type="text"
          placeholder="請輸入姓名"
          required={true}
          onChange={handleNameChange}
          warn={nameError}
        />
        <StyledLink to="/auth">已有帳號了嗎？點此登入</StyledLink>
      </FormContents>
      <FormButton errorArr={errorArr}>完成註冊</FormButton>
    </FormContainer>
  );
};

export default SignUpForm;

export const action = async ({ request }) => {
  const formData = await request.formData();
  const reqData = {
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
  };

  try {
    const response = await fetch("/.netlify/functions/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(reqData),
    });
    const { status, userData } = await response.json();

    if (status === 201) {
      store.dispatch({ type: "user/loadUserData", payload: userData });
      return redirect("/team/new");
    } else if (status === 409) {
      // 顯示使用者已存在訊息
      return null;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
