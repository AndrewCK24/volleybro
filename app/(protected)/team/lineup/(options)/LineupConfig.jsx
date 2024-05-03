import { useDispatch, useSelector } from "react-redux";
import { FiEdit2 } from "react-icons/fi";
import { teamActions } from "../../team-slice";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardBtnGroup } from "@/components/ui/card";
import { ListItem, ListItemText } from "@/app/components/common/List";

const LineupConfig = () => {
  const dispatch = useDispatch();
  const { starting, liberos, substitutes, others } = useSelector(
    (state) => state.team.editingLineup
  );
  const startingCount = starting.filter((player) => player._id).length;
  const liberoCount = liberos.filter((player) => player._id).length;

  return (
    <>
      <CardHeader>
        <CardTitle>陣容資訊</CardTitle>
        <CardBtnGroup>
          <Button
            variant="link"
            size="lg"
            className="px-0"
            onClick={() => dispatch(teamActions.setOptionMode("others"))}
          >
            <FiEdit2 />
            調整替補
          </Button>
        </CardBtnGroup>
      </CardHeader>
      <div className="grid grid-cols-2 gap-2">
        <ListItem type="secondary" text>
          <ListItemText fit>先發：</ListItemText>
          <ListItemText>{startingCount} 人</ListItemText>
        </ListItem>
        <ListItem type="secondary" text>
          <ListItemText fit>自由：</ListItemText>
          <ListItemText>{liberoCount} 人</ListItemText>
        </ListItem>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <ListItem type="secondary" text>
          <ListItemText fit>替補：</ListItemText>
          <ListItemText>{substitutes.length} 人</ListItemText>
        </ListItem>
        <ListItem type="secondary" text>
          <ListItemText fit>其他：</ListItemText>
          <ListItemText>{others.length} 人</ListItemText>
        </ListItem>
      </div>
    </>
  );
};

export default LineupConfig;
