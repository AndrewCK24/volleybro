"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { userActions } from "@/app/(protected)/user/user-slice";
import { teamActions } from "@/app/(protected)/team/team-slice";
import { Section, SectionHr } from "@/app/components/common/Section";
import {
  FormTitle,
  FormContainer,
  FormControl,
  FormButton,
  FormLink,
} from "@/app/components/common/Form";

const SignInForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [emailValue, setEmailValue] = useState("");
  const [emailError, setEmailError] = useState(" ");
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordError, setPasswordError] = useState(" ");
  const errorArr = [emailError, passwordError];

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { email: emailValue, password: passwordValue };
    try {
      const res = await fetch("/api/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.status === 404) return setEmailError("帳號不存在");
      if (res.status === 401) return setPasswordError("密碼有誤");

      if (res.status === 200) {
        const { userData, teamData, membersData } = await res.json();
        dispatch(userActions.setUser(userData));
        if (teamData) dispatch(teamActions.setTeam({ teamData, membersData }));
        return teamData ? router.push("/") : router.push("/team");
      }
    } catch (err) {
      setEmailError("發生未知錯誤，請稍後再試");
      console.log(err);
    }
  };

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  return (
    <Section>
      <FormContainer onSubmit={handleSubmit}>
        <FormTitle>歡迎使用 V-Stats</FormTitle>
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
        <FormLink href="/auth/password">忘記密碼？</FormLink>
        <FormButton errorArr={errorArr}>登入</FormButton>
      </FormContainer>
      <SectionHr content="或使用以下方式登入" />
      <FormButton type="outlined" onClick={handleSignUp}>
        註冊
      </FormButton>
    </Section>
  );
};

export default SignInForm;
