exports.handler = (user) => {
  const { _id, name, email, teamIds, invitingTeamIds } = user;
  return {
    _id,
    name,
    email,
    teamIds,
    invitingTeamIds,
  };
};
