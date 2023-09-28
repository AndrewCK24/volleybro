exports.handler = (user) => {
  const { _id, name, email, teamIds, invitedTeamIds } = user;
  return {
    _id,
    name,
    email,
    teamIds,
    invitedTeamIds,
  };
};
