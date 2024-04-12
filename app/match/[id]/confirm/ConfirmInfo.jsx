import { useSelector } from "react-redux";
import { ListItem, ListItemText } from "@/app/components/common/List";

const ConfirmInfo = () => {
  const { sets, info, status } = useSelector((state) => state.match);
  const { ours, oppo } = info.team;
  const { name, setCount, finalSetPoint } = info.match;
  const { setNum } = status.editingData;
  const firstServe = sets[setNum].meta.firstServe;

  return (
    <>
      <ListItem type="secondary" text>
        <ListItemText>
          {`第 ${setNum + 1} 局 ${firstServe ? "我方" : "對方"}先發球`}
        </ListItemText>
      </ListItem>
      <ListItem type="secondary" text>
        <ListItemText>{`比賽名稱：${name}`}</ListItemText>
      </ListItem>
      <ListItem type="secondary" text>
        <ListItemText>{`我方球隊：${ours.name}`}</ListItemText>
      </ListItem>
      <ListItem type="secondary" text>
        <ListItemText>{`對方球隊：${oppo.name}`}</ListItemText>
      </ListItem>
      <ListItem type="secondary" text>
        <ListItemText>{`比賽局數：${setCount}`}</ListItemText>
      </ListItem>
      <ListItem type="secondary" text>
        <ListItemText>{`最末局完結分數：${finalSetPoint}`}</ListItemText>
      </ListItem>
    </>
  );
};

export default ConfirmInfo;
