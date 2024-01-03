import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { matchActions } from "../../match-slice";
import { teamActions } from "@/app/(protected)/team/team-slice";
import {
  FormContainer,
  FormControl,
  FormSelect,
  FormButton,
} from "@/app/components/common/Form";

const Info = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    _id: teamId,
    name: teamName,
    lineup,
  } = useSelector((state) => state.team);
  const match = useSelector((state) => state.match);

  const [firstServeValue, setFirstServeValue] = useState(true);
  const [oursNameValue, setOursNameValue] = useState(teamName);
  const [oppoNameValue, setOppoNameValue] = useState("");
  const [matchNameValue, setMatchNameValue] = useState("");
  const [formalMatchValue, setFormalMatchValue] = useState(true);
  const [setCountValue, setSetCountValue] = useState(3);
  const [finalSetPointValue, setFinalSetPointValue] = useState(15);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      teamId,
      firstServe: firstServeValue,
      oursName: oursNameValue,
      oppoName: oppoNameValue,
      matchName: matchNameValue,
      formalMatch: formalMatchValue,
      setCount: setCountValue,
      finalSetPoint: finalSetPointValue,
      lineup,
    };
    dispatch(matchActions.configMatch(formData));
    try {
      const response = await fetch("/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(match),
      });
      const { teamData, newMatch } = await response.json();
      dispatch(teamActions.updateTeamOnly(teamData));
      router.push(`/match/${newMatch}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormControl
        name="matchName"
        labelText="比賽名稱"
        type="text"
        placeholder="請輸入比賽名稱"
        onChange={setMatchNameValue}
      />
      <FormControl
        name="oursName"
        labelText="我方隊伍名稱"
        type="text"
        placeholder="請輸入我方隊伍名稱"
        defaultValue={teamName}
        onChange={setOursNameValue}
      />
      <FormControl
        name="oppoName"
        labelText="對手隊伍名稱"
        type="text"
        placeholder="請輸入對手隊伍名稱"
        onChange={setOppoNameValue}
      />
      <FormSelect
        name="firstServe"
        labelText="發球權"
        options={[
          { id: "ours", value: true, text: "我方發球" },
          { id: "oppo", value: false, text: "對方發球" },
        ]}
        defaultValue={true}
        required
        onChange={setFirstServeValue}
      />
      <FormSelect
        name="formalMatch"
        labelText="比賽類型"
        options={[
          { id: "formal", value: true, text: "正式賽" },
          { id: "practice", value: false, text: "練習賽" },
        ]}
        defaultValue={true}
        required
        onChange={setFormalMatchValue}
      />
      <FormSelect
        name="setCount"
        labelText="比賽局數"
        options={[
          { id: "3", value: 3, text: "3局2勝" },
          { id: "5", value: 5, text: "5局3勝" },
          { id: "0", value: 0, text: "其他" },
        ]}
        defaultValue={3}
        required
        onChange={setSetCountValue}
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
        onChange={setFinalSetPointValue}
      />
      <FormButton>開始比賽</FormButton>
    </FormContainer>
  );
};

export default Info;
