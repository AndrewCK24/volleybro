const hidePassword = (user) => {
  const { password, ...rest } = user._doc;
  return rest;
};

export default hidePassword;
