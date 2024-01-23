import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { matchActions } from "@/app/match/match-slice";
import {
  FormContainer,
  FormControl,
  FormSelect,
} from "@/app/components/common/Form";
import { ListItem } from "@/app/components/common/List";

const Info = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const {
    _id: teamId,
    name: teamName,
    members,
  } = useSelector((state) => state.team);
  const { _id: matchId, info } = useSelector((state) => state.match);
  const isNew = pathname.includes("/match/new");

  const [matchName, setMatchName] = useState(info.match.name || "");
  const [oursName, setOursName] = useState(info.team.ours.name || teamName);
  const [oppoName, setOppoName] = useState(info.team.oppo.name || "");
  const [setCount, setSetCount] = useState(info.match.setCount || 3);
  const [finalSetPoint, setFinalSetPoint] = useState(
    info.match.finalSetPoint || 15
  );

  const handleSave = () => {
    const formData = {
      teamId,
      members,
      oursName: oursName,
      oppoName: oppoName,
      matchName: matchName,
      setCount: setCount,
      finalSetPoint: finalSetPoint,
    };
    dispatch(matchActions.configMatchInfo(formData));
    isNew
      ? router.replace(`/match/new/lineup`)
      : router.push(`/match/${matchId}`);
  };

  return (
    <>
      <FormContainer>
        <FormControl
          name="matchName"
          labelText="比賽名稱"
          type="text"
          placeholder="請輸入比賽名稱"
          onChange={setMatchName}
        />
        <FormControl
          name="oursName"
          labelText="我方隊伍名稱"
          type="text"
          placeholder="請輸入我方隊伍名稱"
          defaultValue={teamName}
          onChange={setOursName}
        />
        <FormControl
          name="oppoName"
          labelText="對手隊伍名稱"
          type="text"
          placeholder="請輸入對手隊伍名稱"
          onChange={setOppoName}
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
          onChange={setSetCount}
        />
        <FormSelect
          name="finalSetPoint"
          labelText="最終局分數"
          options={[
            { id: "15", value: 15, text: "15分" },
            { id: "25", value: 25, text: "25分" },
          ]}
          defaultValue={15}
          required
          onChange={setFinalSetPoint}
        />
      </FormContainer>
      <ListItem type="primary" center onClick={handleSave}>
        {isNew ? "下一步" : "儲存資訊"}
      </ListItem>
    </>
  );
};

export default Info;
