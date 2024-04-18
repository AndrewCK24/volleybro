import { useDispatch, useSelector } from "react-redux";
import { FiEdit2 } from "react-icons/fi";
import { teamActions } from "../../team-slice";
import {
  ListHeader,
  ListTitle,
  ListItemContainer,
  ListItem,
  ListItemText,
} from "@/app/components/common/List";

const LineupConfig = () => {
  const dispatch = useDispatch();
  const { starting, liberos, substitutes, others } = useSelector(
    (state) => state.team.editingLineup
  );
  const startingCount = starting.filter((player) => player._id).length;
  const liberoCount = liberos.filter((player) => player._id).length;

  return (
    <>
      <ListHeader>
        <ListTitle>陣容資訊</ListTitle>
        <ListItem
          type="primary"
          center
          onClick={() => dispatch(teamActions.setOptionMode("others"))}
        >
          <FiEdit2 />
          <ListItemText fit> 調整替補</ListItemText>
        </ListItem>
      </ListHeader>
      <ListItemContainer>
        <ListItem type="secondary" text>
          <ListItemText fit>先發：</ListItemText>
          <ListItemText>{startingCount} 人</ListItemText>
        </ListItem>
        <ListItem type="secondary" text>
          <ListItemText fit>自由：</ListItemText>
          <ListItemText>{liberoCount} 人</ListItemText>
        </ListItem>
      </ListItemContainer>
      <ListItemContainer>
        <ListItem type="secondary" text>
          <ListItemText fit>替補：</ListItemText>
          <ListItemText>{substitutes.length} 人</ListItemText>
        </ListItem>
        <ListItem type="secondary" text>
          <ListItemText fit>其他：</ListItemText>
          <ListItemText>{others.length} 人</ListItemText>
        </ListItem>
      </ListItemContainer>
    </>
  );
};

export default LineupConfig;
