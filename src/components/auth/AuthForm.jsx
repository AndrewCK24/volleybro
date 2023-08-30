import {
  StyledForm,
  StyledLabel,
  StyledInput,
  StyledButton,
  StyledLink,
} from "../general/Form";

const AuthForm = () => {
  return (
    <StyledForm method="post" action="/auth">
      <StyledLabel htmlFor="email">帳號</StyledLabel>
      <StyledInput
        type="email"
        placeholder="email"
        id="email"
        name="email"
        required
        autoComplete="on"
      />
      <StyledLabel htmlFor="password">密碼</StyledLabel>
      <StyledInput
        type="password"
        placeholder="password"
        id="password"
        name="password"
        required
        autoComplete="on"
      />
      <StyledLink to="/auth/password">忘記密碼？</StyledLink>
      <StyledButton type="submit">註冊 / 登入</StyledButton>
    </StyledForm>
  );
};

export default AuthForm;
