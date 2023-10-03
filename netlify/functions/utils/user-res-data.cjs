exports.handler = (user) => {
  const { _id, name, email, teams, invitingTeams } = user;
  return {
    _id,
    name,
    email,
    teams,
    invitingTeams,
  };
};
