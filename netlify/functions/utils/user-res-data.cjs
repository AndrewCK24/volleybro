exports.handler = (user) => {
  const { _id, email, teamIds } = user;
  return {
    _id,
    email,
    teamIds,
  };
};
