const Confirm = () => {
  const handleSave = async () => {
    try {
      const response = await fetch("/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(matchData),
      });
      const { teamData, newMatch } = await response.json();
      dispatch(teamActions.updateTeamOnly(teamData));
      router.push(`/match/${newMatch}`);
    } catch (error) {
      console.log(error);
    }
  };
  return <></>;
};

export default Confirm;
