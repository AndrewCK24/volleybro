"use client";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    _id: teamId,
    members,
    editingLineup,
  } = useSelector((state) => state.team);
  const { starting, liberos, substitutes, others, status } = editingLineup;
  const { stage } = status;

  const subLimit = liberos.length === 2 ? 6 : 6 - liberos.length;
  const lists = [
    { key: "starting", text: "先發球員", limit: 6 },
    { key: "liberos", text: "自由球員", limit: 2 },
    { key: "substitutes", text: "替補球員", limit: subLimit },
  ];
  const stageIndex = lists.findIndex((s) => s.key === stage);

  const handlePreviousClicked = () => {
    const index = stageIndex - 1;
    if (index < 0) return router.push("/team/lineup");
    dispatch(teamActions.setCompositionEditingStage(lists[index].key));
  };
  const handleNextClicked = async () => {
    const index = stageIndex + 1;
    if (index >= lists.length) {
      try {
        const response = await fetch(`/api/teams/${teamId}/lineup`, {
          method: "PATCH",
          body: JSON.stringify(editingLineup),
        });
        const data = await response.json();
        const { teamData } = data;
        dispatch(teamActions.updateTeamOnly(teamData));
      } catch (error) {
        console.error("[set-composition]", error);
      }
      return;
    }
    dispatch(teamActions.setCompositionEditingStage(lists[index].key));
  };

  return (
    <>
      <Section>
        <ListHeader>
          <ListTitle>{`${lists[stageIndex].text} (${
            editingLineup[lists[stageIndex].key].length
          }/${lists[stageIndex].limit})`}</ListTitle>
        </ListHeader>
        <ListItemContainer>
          {editingLineup[stage].map((player, index) => {
            const member = members.find((member) => member._id === player._id);
            return (
              <ListItem
                key={index}
                type="primary"
                onClick={() =>
                  dispatch(
                    teamActions.selectCompositionPlayer({
                      player,
                      index,
                      origin: stage,
                    })
                  )
                }
              >
                <ListItemText minimized>{member?.number}</ListItemText>
                <ListItemText>{member?.name}</ListItemText>
              </ListItem>
            );
          })}
        </ListItemContainer>
      </Section>
      <Section type="fixed">
        {starting.map((player, index) => {
          const member = members.find((member) => member._id === player._id);
          return (
            member && (
              <ListItem
                key={index}
                onClick={() =>
                  dispatch(
                    teamActions.selectCompositionPlayer({
                      player,
                      index,
                      origin: "starting",
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
        {liberos.map((player, index) => {
          const member = members.find((member) => member._id === player._id);
          return (
            member && (
              <ListItem
                key={index}
                onClick={() =>
                  dispatch(
                    teamActions.selectCompositionPlayer({
                      player,
                      index,
                      origin: "liberos",
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
        {substitutes.map((player, index) => {
          const member = members.find((member) => member._id === player._id);
          return (
            member && (
              <ListItem
                key={index}
                onClick={() =>
                  dispatch(
                    teamActions.selectCompositionPlayer({
                      player,
                      index,
                      origin: "substitutes",
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
        {others.map((player, index) => {
          const member = members.find((member) => member._id === player._id);
          return (
            member && (
              <ListItem
                key={index}
                onClick={() =>
                  dispatch(
                    teamActions.selectCompositionPlayer({
                      player,
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
        <ListItem type="danger" onClick={() => handlePreviousClicked()}>
          <ListItemText>
            {stageIndex !== 0
              ? `上一步：編輯${lists[stageIndex - 1].text}名單`
              : "取消編輯名單"}
          </ListItemText>
        </ListItem>
        <ListItem
          type="primary"
          onClick={() => handleNextClicked()}
          disabled={stageIndex === 0 && starting.length < 6}
        >
          <ListItemText>
            {stageIndex !== lists.length - 1
              ? `下一步：編輯${lists[stageIndex + 1].text}名單`
              : "儲存陣容名單"}
          </ListItemText>
        </ListItem>
      </Section>
    </>
  );
};

export default LineupComposition;
