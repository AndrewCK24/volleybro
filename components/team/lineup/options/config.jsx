import { useDispatch, useSelector } from "react-redux";
import { FiUser } from "react-icons/fi";
import { lineupsActions } from "@/app/store/lineups-slice";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LineupConfig = ({ members, className }) => {
  const dispatch = useDispatch();
  const { lineups, status } = useSelector((state) => state.lineups);
  const liberoCount = lineups[status.lineupNum]?.liberos.filter(
    (player) => player._id
  ).length;
  const substituteCount = lineups[status.lineupNum]?.substitutes.length;
  const substituteLimit = liberoCount < 2 ? 6 - liberoCount : 6;
  const othersCount = lineups[status.lineupNum]?.others.length;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>陣容資訊</CardTitle>
      </CardHeader>
      <Table>
        <TableHeader className="text-lg">
          <TableRow>
            <TableHead colSpan={3}>
              <div className="flex items-center justify-start">
                <span className="flex-1">
                  替補名單 ({substituteCount}/{substituteLimit})
                </span>
                <Button
                  variant="link"
                  size="lg"
                  className="px-0 w-fit"
                  onClick={() =>
                    dispatch(lineupsActions.setOptionMode("others"))
                  }
                >
                  調整
                </Button>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-xl">
          {lineups[status.lineupNum]?.substitutes &&
            lineups[status.lineupNum].substitutes.map((player) => {
              const member = members?.find((m) => m._id === player._id);
              return (
                <TableRow key={member._id}>
                  <TableCell className="w-6 [&>svg]:w-6 [&>svg]:h-6">
                    <FiUser />
                  </TableCell>
                  <TableCell className="text-right w-[2.5rem]">
                    {member?.number}
                  </TableCell>
                  <TableCell>{member?.name}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      <Table>
        <TableHeader className="text-lg">
          <TableRow>
          <TableHead colSpan={3}>
              <div className="flex items-center justify-start">
                <span className="flex-1">
                  其他名單 ({othersCount})
                </span>
                <Button
                  variant="link"
                  size="lg"
                  className="px-0 w-fit"
                  onClick={() =>
                    dispatch(lineupsActions.setOptionMode("others"))
                  }
                >
                  調整
                </Button>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-xl">
          {lineups[status.lineupNum]?.others &&
            lineups[status.lineupNum].others.map((player) => {
              const member = members?.find((m) => m._id === player._id);
              return (
                <TableRow key={member._id}>
                  <TableCell className="w-6 [&>svg]:w-6 [&>svg]:h-6">
                    <FiUser />
                  </TableCell>
                  <TableCell className="text-right w-[2.5rem]">
                    {member?.number}
                  </TableCell>
                  <TableCell colSpan={2}>{member?.name}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </Card>
  );
};

export default LineupConfig;
