"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { userActions } from "@/app/user/user-slice";
import {
  FormContainer,
  FormTitle,
  FormContents,
  FormControl,
  FormButton,
  FormHr,
} from "../../components/common/Form";

const SignUpForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [emailValue, setEmailValue] = useState("");
  const [emailError, setEmailError] = useState(" ");
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordError, setPasswordError] = useState(" ");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(" ");
  const [nameValue, setNameValue] = useState("");
  const [nameError, setNameError] = useState(" ");
  const errorArr = [emailError, passwordError, confirmPasswordError, nameError];

  const handleEmailChange = (value) => {
    setEmailValue(value);
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
    setPasswordValue(value);
    if (value.length === 0) {
      setPasswordError("密碼不得為空");
    } else if (value.length > 20) {
      setPasswordError("密碼不得超過20字");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPasswordValue(value);
    if (value !== passwordValue) {
      setConfirmPasswordError("密碼不一致");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleNameChange = (value) => {
    setNameValue(value);
    if (value.length === 0) {
      setNameError("使用者名稱不得為空");
    } else if (value.length > 20) {
      setNameError("使用者名稱不得超過20字");
    } else {
      setNameError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      email: emailValue,
      password: passwordValue,
      confirm_password: confirmPasswordValue,
      name: nameValue,
    };
    console.log(formData);

    try {
      const res = await fetch("/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.status === 409) return setEmailError("帳號已存在");
      if (res.status === 400) return setConfirmPasswordError("密碼不一致");

      if (res.status === 201) {
        const { userData } = await res.json();
        dispatch(userActions.setUser(userData));
        return router.push("/team");
      }
    } catch (err) {
      setEmailError("發生未知錯誤，請稍後再試");
      console.log(err);
    }
  };

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  return (
    <FormContainer className="minimized">
      <FormTitle>開始註冊 V-Stats</FormTitle>
      <FormContents onSubmit={handleSubmit}>
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
        <FormControl
          name="confirmPassword"
          labelText="確認密碼"
          type="password"
          placeholder="請再次輸入密碼"
          required={true}
          onChange={handleConfirmPasswordChange}
          warn={confirmPasswordError}
        />
        <FormControl
          name="name"
          labelText="使用者名稱"
          type="text"
          placeholder="請輸入中英文名稱"
          required={true}
          onChange={handleNameChange}
          warn={nameError}
        />
        <FormButton errorArr={errorArr}>註冊</FormButton>
      </FormContents>
      <FormHr content="已有帳號了嗎？" />
      <FormButton className="text" onClick={handleSignIn}>
        返回登入頁
      </FormButton>
    </FormContainer>
  );
};

export default SignUpForm;
