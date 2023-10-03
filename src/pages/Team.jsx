import { Outlet } from "react-router-dom";

import store from "../store";

const TeamPage = () => {
  return <Outlet />;
};

export default TeamPage;

export const loader = async () => {
  const { _id: teamId } = store.getState().team;
  if (teamId) return null;
  try {
    const response = await fetch("/.netlify/functions/fetch-team-by-default", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    const { teamData } = await response.json();
    store.dispatch({ type: "team/loadTeamData", payload: teamData });

    return null;
  } catch (error) {
    console.error(error);
    return { error };
  }
};
