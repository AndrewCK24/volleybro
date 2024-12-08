import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { RiUserLine } from "react-icons/ri";
import { lineupActions } from "@/lib/features/team/lineup-slice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBtnGroup,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LineupError from "@/components/team/lineup/panels/options/lineup-error";
import LiberoSwitch from "@/components/team/lineup/panels/options/libero-switch";

import { LineupOptionMode } from "@/lib/features/team/types";

const LineupOptions = ({
  members,
  others,
  hasPairedSwitchPosition,
  className,
}) => {
  const dispatch = useAppDispatch();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { lineups, status } = useAppSelector((state) => state.lineup);
  const liberoCount = lineups[status.lineupIndex]?.liberos.length;
  const substituteCount = lineups[status.lineupIndex]?.substitutes.length;
  const substituteLimit = liberoCount < 2 ? 6 - liberoCount : 6;
  const othersCount = others.length;

  const handlelineupIndexClick = (index) => {
    if (index === status.lineupIndex) return;
    if (hasPairedSwitchPosition) {
      dispatch(lineupActions.setLineupIndex(index));
    } else {
      setDialogOpen(true);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>陣容配置 {status.lineupIndex + 1}</CardTitle>
        <CardBtnGroup>
          {lineups.map((_, index) => (
            <Button
              key={index}
              variant={status.lineupIndex === index ? "default" : "outline"}
              size="icon"
              onClick={() => handlelineupIndexClick(index)}
              className="text-[1.25rem] w-8 h-8"
            >
              {index + 1}
            </Button>
          ))}
        </CardBtnGroup>
      </CardHeader>
      <LineupError open={dialogOpen} setOpen={setDialogOpen} />
      <LiberoSwitch />
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
                    dispatch(
                      lineupActions.setOptionMode(LineupOptionMode.SUBSTITUTES)
                    )
                  }
                >
                  調整
                </Button>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-xl">
          {lineups[status.lineupIndex]?.substitutes &&
            lineups[status.lineupIndex].substitutes.map((player) => {
              const member = members?.find((m) => m._id === player._id);
              return (
                <TableRow key={member._id}>
                  <TableCell className="w-6 [&>svg]:w-6 [&>svg]:h-6">
                    <RiUserLine />
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
                <span className="flex-1">未入選名單 ({othersCount})</span>
                <Button
                  variant="link"
                  size="lg"
                  className="px-0 w-fit"
                  onClick={() =>
                    dispatch(
                      lineupActions.setOptionMode(LineupOptionMode.SUBSTITUTES)
                    )
                  }
                >
                  調整
                </Button>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-xl">
          {others &&
            others.map((member) => {
              return (
                <TableRow key={member._id}>
                  <TableCell className="w-6 [&>svg]:w-6 [&>svg]:h-6">
                    <RiUserLine />
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

export default LineupOptions;
