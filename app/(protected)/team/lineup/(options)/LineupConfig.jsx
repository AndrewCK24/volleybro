import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { FiEdit2 } from "react-icons/fi";
import {
  ListItemContainer,
  ListItem,
  ListItemText,
} from "@/app/components/common/List";
import { FormControl, FormSelect } from "@/app/components/common/Form";

const LineupConfig = () => {
  const router = useRouter();
  const { starting, liberos, substitutes } = useSelector(
    (state) => state.team.lineup
  );
  const playerCounts = starting.length + liberos.length + substitutes.length;

  return (
    <>
      <ListItem onClick={() => router.push("/team/lineup/composition")}>
        <ListItemText>名單人數 / 上限：</ListItemText>
        <ListItemText fit>
          {playerCounts} / {liberos.length === 2 ? "14" : "12"}
        </ListItemText>
        <FiEdit2 />
      </ListItem>
      <FormControl
        name="oppoName"
        labelText="對手隊伍名稱"
        type="text"
        placeholder="請輸入對手隊伍名稱"
        // onChange={setOppoName}
      />
      <FormSelect
        name="setCount"
        labelText="比賽局數"
        options={[
          { id: "3", value: 3, text: "3局2勝" },
          { id: "5", value: 5, text: "5局3勝" },
        ]}
        defaultValue={3}
        required
        // onChange={setSetCount}
      />
    </>
  );
};

export default LineupConfig;
