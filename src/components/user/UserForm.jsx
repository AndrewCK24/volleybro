import {
  StyledForm,
  StyledLabel,
  StyledInput,
  StyledButton,
} from "../general/Form";

const UserForm = () => {
  return (
    <StyledForm method="post" action="/auth/signUp">
      <StyledLabel htmlFor="name">姓名</StyledLabel>
      <StyledInput
        type="name"
        placeholder="name"
        id="name"
        name="name"
        required
        autoComplete="on"
      />
      <StyledButton type="submit">完成註冊</StyledButton>
    </StyledForm>
  );
};

export default UserForm;
