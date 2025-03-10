import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { lineupActions } from "@/lib/features/team/lineup-slice";
import { BsGrid3X2Gap } from "react-icons/bs";
import {
  RiArrowLeftWideLine,
  RiHashtag,
  RiListUnordered,
  RiUserLine,
  RiEditBoxLine,
  RiNumbersLine,
  RiRepeat2Line,
} from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

import { LineupOptionMode } from "@/lib/features/team/types";

const PlayerInfo = ({ members, className }) => {
  const dispatch = useAppDispatch();
  const { status, lineups } = useAppSelector((state) => state.lineup);
  const { lineupIndex, editingMember } = status;
  const player =
    lineups[lineupIndex][editingMember.list][editingMember.zone - 1];
  const member = members.find((member) => member._id === editingMember._id);

  return (
    <Card className={className}>
      <CardHeader className="flex-row items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            dispatch(lineupActions.setOptionMode(LineupOptionMode.NONE))
          }
        >
          <RiArrowLeftWideLine />
        </Button>
        <CardTitle className="flex-1">球員資訊</CardTitle>
        <Button
          onClick={() =>
            dispatch(lineupActions.setOptionMode(LineupOptionMode.SUBSTITUTES))
          }
        >
          <RiRepeat2Line />
          更換球員
        </Button>
      </CardHeader>
      <Table>
        <TableHeader className="text-lg">
          <TableRow>
            <TableHead className="w-6">
              <RiListUnordered />
            </TableHead>
            <TableHead colSpan={2}>基本資訊</TableHead>
            <TableHead className="w-6" />
          </TableRow>
        </TableHeader>
        <TableBody className="text-xl">
          <TableRow>
            <TableCell>
              <RiHashtag />
            </TableCell>
            <TableCell className="w-16">背號</TableCell>
            <TableCell>{member?.number}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <RiUserLine />
            </TableCell>
            <TableCell>姓名</TableCell>
            <TableCell>{member?.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <BsGrid3X2Gap />
            </TableCell>
            <TableCell>位置</TableCell>
            <TableCell>{player?.position}</TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  dispatch(
                    lineupActions.setOptionMode(LineupOptionMode.POSITIONS)
                  )
                }
              >
                <RiEditBoxLine />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Table>
        <TableHeader className="text-lg">
          <TableRow>
            <TableHead className="w-6">
              <RiNumbersLine />
            </TableHead>
            <TableHead>數據統計</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    </Card>
  );
};

export default PlayerInfo;
