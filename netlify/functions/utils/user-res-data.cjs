exports.handler = (user) => {
  const { _id, name, email, teamIds } = user;
  return {
    _id,
    name,
    email,
    teamIds,
  };
};
