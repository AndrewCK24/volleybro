import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { teamActions } from "@/app/(protected)/team/team-slice";
import { Section } from "@/app/components/common/Section";
import { ListItem } from "@/app/components/common/List";
import ConfirmCourt from "./ConfirmCourt";
import ConfirmInfo from "./ConfirmInfo";

const Confirm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const matchData = useSelector((state) => state.match);

  const handleSave = async () => {
    try {
      const response = await fetch("/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(matchData),
      });
      const { teamData, matchId } = await response.json();
      dispatch(teamActions.updateTeamOnly(teamData));
      router.push(`/match/${matchId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Section>
        <ConfirmCourt />
      </Section>
      <Section type="fixed">
        <ConfirmInfo />
      </Section>
      <Section type="transparent">
        <ListItem type="primary" center onClick={handleSave}>
          確認比賽資訊
        </ListItem>
      </Section>
    </>
  );
};

export default Confirm;
