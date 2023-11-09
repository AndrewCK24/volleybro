"use client";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { ListItem, ListItemText } from "../../components/common/List";

import { userActions } from "./user-slice";
import { teamActions } from "../team/team-slice";

const getTeams = async () => {
  const response = await fetch(`/api/teams`, {
    next: {
      forceCache: true,
    },
  });
  const { teams } = await response.json();
  console.log(teams);
  return teams;
};

const Teams = async () => {
  console.log("Teams, render");
  const router = useRouter();
  const dispatch = useDispatch();
  const teams = await getTeams();

  const handleTeamSwitch = async (index, teamId) => {
    if (index === 0) {
      router.push("/team");
      return;
    }

    try {
      const response = await fetch("/.netlify/functions/fetch-team-by-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ teamId }),
      });
      const { status, userData, teamData } = await response.json();
      if (status === 200) {
        router.push("/team");
        dispatch(userActions.setUser(userData));
        // dispatch(teamActions.loadTeamData(teamData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {teams &&
        teams.map((team, index) => (
          <ListItem
            key={team.id}
            onClick={() => handleTeamSwitch(index, team.id)}
          >
            <ListItemText className="extend">{team.name}</ListItemText>
          </ListItem>
        ))}
    </>
  );
};

export default Teams;
