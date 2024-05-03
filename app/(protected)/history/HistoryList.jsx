"use client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { ListItem, ListItemText } from "@/app/components/common/List";

const HistoryList = () => {
  const router = useRouter();
  const { matches } = useSelector((state) => state.team);
  return (
    <>
      {matches.map((matchId) => (
        <ListItem
          key={matchId}
          onClick={() => router.push(`/match/${matchId}`)}
        >
          <ListItemText>比賽</ListItemText>
        </ListItem>
      ))}
    </>
  );
};

export default HistoryList;
