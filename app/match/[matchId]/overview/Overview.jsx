"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ListItem, ListItemText } from "@/app/components/common/List";

const Overview = () => {
  const { setNum } = useSelector((state) => state.match.status.editingData);
  const { players, sets } = useSelector((state) => state.match);
  const [viewingSet, setViewingSet] = useState(setNum);
  const setCount = players.oppo.serving.successful.length;
  const attackPoints = Array(setCount).fill(0);
  const blockingPoints = Array(setCount).fill(0);
  const servingPoints = Array(setCount).fill(0);

  for (const player in players) {
    if (player !== "oppo") {
      for (let i = 0; i < setCount; i++) {
        attackPoints[i] += players[player].attack.successful[i];
        blockingPoints[i] += players[player].blocking.successful[i];
        servingPoints[i] += players[player].serving.successful[i];
      }
    }
  }

  return (
    <>
      <ListItem>
        <ListItemText>{attackPoints[viewingSet]}</ListItemText>
        <ListItemText>攻擊得分</ListItemText>
        <ListItemText>
          {players.oppo.attack.successful[viewingSet]}
        </ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>{blockingPoints[viewingSet]}</ListItemText>
        <ListItemText>攔網得分</ListItemText>
        <ListItemText>
          {players.oppo.blocking.successful[viewingSet]}
        </ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>{servingPoints[viewingSet]}</ListItemText>
        <ListItemText>發球得分</ListItemText>
        <ListItemText>
          {players.oppo.serving.successful[viewingSet]}
        </ListItemText>
      </ListItem>
    </>
  );
};

export default Overview;
