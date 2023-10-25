const hideUserPassword = (user) => {
  const { password, ...rest } = user._doc;
  return rest;
};

export default hideUserPassword;
