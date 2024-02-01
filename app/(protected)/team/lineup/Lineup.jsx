import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { teamActions } from "../team-slice";
import { matchActions } from "@/app/match/match-slice";
import { FiRotateCcw, FiSave, FiX } from "react-icons/fi";
import { Section } from "@/app/components/common/Section";
import { ListItemContainer, ListItem } from "@/app/components/common/List";
import { FormSelect } from "@/app/components/common/Form";
import LineupCourt from "./LineupCourt";
import LineupOptions from "./LineupOptions";

const Lineup = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isRecording = pathname.includes("match");
  const matchId = useSelector((state) => state.match._id) || "new";
  const { setNum } = useSelector((state) => state.match.status.editingData);
  const setData = useSelector((state) => state.match.sets[setNum]);
  const [firstServe, setFirstServe] = useState(
    setData.meta.firstServe === null ? true : setData.meta.firstServe
  );
  const { _id: teamId, editingLineup } = useSelector((state) => state.team);
  const { starting, liberos, substitutes, others, edited, status } =
    editingLineup;

  const handleSave = async () => {
    const lineup = {
      starting,
      liberos,
      substitutes,
      others,
    };
    if (edited) {
      try {
        const response = await fetch(`/api/teams/${teamId}/lineup`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(lineup),
        });
        const { userData, teamData, membersData } = await response.json();
        dispatch(teamActions.setTeam({ userData, teamData, membersData }));
      } catch (error) {
        console.log(error);
      }
    }
    if (isRecording) {
      dispatch(matchActions.configMatchSet({ firstServe, lineup }));
      router.push(`/match/${matchId}/confirm`);
    }
  };

  const handleCancel = () => {
    dispatch(teamActions.resetEditingLineup());
    if (!isRecording) router.push("/team");
  };

  return (
    <>
      <Section>
        <LineupCourt />
        {isRecording && (
          <FormSelect
            name="firstServe"
            options={[
              { id: "ours", value: true, text: "我方先發" },
              { id: "oppo", value: false, text: "對方先發" },
            ]}
            defaultValue={firstServe}
            required
            onChange={setFirstServe}
          />
        )}
      </Section>
      <Section type="fixed">
        <LineupOptions />
      </Section>
      <Section type="transparent">
        <ListItemContainer>
          {isRecording ? (
            <>
              <ListItem type="secondary" text center onClick={handleCancel}>
                <FiRotateCcw />
                恢復預設
              </ListItem>
              <ListItem type="primary" center onClick={handleSave}>
                <FiSave />
                確認陣容
              </ListItem>
            </>
          ) : (
            <>
              <ListItem type="secondary" text center onClick={handleCancel}>
                <FiX />
                取消編輯
              </ListItem>
              <ListItem
                type={!edited || status.editingZone ? "secondary" : "primary"}
                center
                disabled={!edited || status.editingZone}
                onClick={handleSave}
              >
                <FiSave />
                儲存陣容
              </ListItem>
            </>
          )}
        </ListItemContainer>
      </Section>
    </>
  );
};

export default Lineup;
