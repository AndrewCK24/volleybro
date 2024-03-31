"use client";
import { useDispatch, useSelector } from "react-redux";
import { teamActions } from "../../team-slice";
import { Section } from "@/app/components/common/Section";
import {
  ListHeader,
  ListTitle,
  ListItemContainer,
  ListItem,
  ListItemText,
} from "@/app/components/common/List";

const LineupComposition = () => {
  const dispatch = useDispatch();
  const { members, editingLineup } = useSelector((state) => state.team);
  const { starting, liberos, substitutes, others, status } = editingLineup;
  const { stage } = status;

  return (
    <>
      <Section type="fixed">
        <ListHeader>
          <ListTitle>比賽名單設定</ListTitle>
        </ListHeader>
        <ListItemContainer>
          {editingLineup[stage].map((player, index) => {
            const member = members.find(
              (member) => member._id === player.member_id
            );
            return (
              <ListItem
                key={index}
                type="primary"
                onClick={() =>
                  dispatch(
                    teamActions.removeCompositionPlayer({ player, index })
                  )
                }
              >
                <ListItemText minimized>{member?.number}</ListItemText>
                <ListItemText>{member?.name}</ListItemText>
              </ListItem>
            );
          })}
        </ListItemContainer>
        {starting.map((player, index) => {
          const member = members.find(
            (member) => member._id === player.member_id
          );
          return (
            member && (
              <ListItem key={index}>
                <ListItemText minimized>{member?.number}</ListItemText>
                <ListItemText>{member?.name}</ListItemText>
              </ListItem>
            )
          );
        })}
        {liberos.map((player, index) => {
          const member = members.find(
            (member) => member._id === player.member_id
          );
          return (
            member && (
              <ListItem key={index}>
                <ListItemText minimized>{member?.number}</ListItemText>
                <ListItemText>{member?.name}</ListItemText>
              </ListItem>
            )
          );
        })}
        {substitutes.map((player, index) => {
          const member = members.find(
            (member) => member._id === player.member_id
          );
          return (
            member && (
              <ListItem key={index}>
                <ListItemText minimized>{member?.number}</ListItemText>
                <ListItemText>{member?.name}</ListItemText>
              </ListItem>
            )
          );
        })}
        {others.map((player, index) => {
          const member = members.find((member) => member._id === player);
          return (
            member && (
              <ListItem
                key={index}
                onClick={() =>
                  dispatch(
                    teamActions.selectCompositionPlayer({
                      player: { _id: player },
                      index,
                      origin: "others",
                    })
                  )
                }
              >
                <ListItemText minimized>{member?.number}</ListItemText>
                <ListItemText>{member?.name}</ListItemText>
              </ListItem>
            )
          );
        })}
      </Section>
      <Section type="transparent">
        <ListItem>
          <ListItemText>取消名單設定</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>比賽名單設定</ListItemText>
        </ListItem>
      </Section>
    </>
  );
};

export default LineupComposition;
