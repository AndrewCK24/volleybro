import { useState } from "react";
import {
  FormContainer,
  FormTitle,
  FormContents,
  FormControl,
  FormButton,
  StyledLink,
} from "../general/Form";

const AuthForm = () => {
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
    <FormContainer method="post" action="/auth">
      <FormTitle>歡迎回來 V-Stats</FormTitle>
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

export default AuthForm;
