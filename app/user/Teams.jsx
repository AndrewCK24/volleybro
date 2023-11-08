"use client";
import { useState, useEffect } from "react";
import { ListItem, ListItemContent } from "../components/common/List";

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

const Teams = async ({ handleTeamSwitch }) => {
  console.log("Teams, render");
  const [teams, setTeams] = useState(null);
  useEffect(() => {
    getTeams().then((teams) => setTeams(teams));
  }, []);
  return (
    <>
      {teams &&
        teams.map((team, index) => (
          <ListItem
            key={team.id}
            onClick={() => handleTeamSwitch(index, team.id)}
          >
            <ListItemContent className="extend">{team.name}</ListItemContent>
          </ListItem>
        ))}
    </>
  );
};

export default Teams;
