import { useDispatch, useSelector } from "react-redux";
import {
  FiUser,
  FiCheck,
  FiX,
  FiHelpCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import { lineupsActions } from "@/app/store/lineups-slice";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
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
import { Separator } from "@/components/ui/separator";

const LineupConfig = ({ members, others, className }) => {
  const dispatch = useDispatch();
  const { lineups, status } = useSelector((state) => state.lineups);
  const liberoCount = lineups[status.lineupNum]?.liberos.length;
  const substituteCount = lineups[status.lineupNum]?.substitutes.length;
  const substituteLimit = liberoCount < 2 ? 6 - liberoCount : 6;
  const othersCount = others.length;
  const liberoMode = lineups[status.lineupNum]?.config.liberoMode;
  const hasPairedMB = lineups[status.lineupNum]?.starting.some(
    (player, index) => {
      const oppositeIndex = index > 3 ? index - 3 : index + 3;
      return (
        player._id &&
        player.position === "MB" &&
        lineups[status.lineupNum].starting[oppositeIndex]._id &&
        lineups[status.lineupNum].starting[oppositeIndex].position === "MB"
      );
    }
  );

  const handleLiberoMode = (mode) => {
    if (mode !== liberoMode) dispatch(lineupsActions.setLiberoMode(mode));
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>陣容配置 {status.lineupNum + 1}</CardTitle>
        <CardBtnGroup>
          {lineups.map((_, index) => (
            <Button
              key={index}
              variant={status.lineupNum === index ? "" : "outline"}
              size="icon"
              onClick={() => dispatch(lineupsActions.setLineupNum(index))}
              className="text-[1.25rem] w-8 h-8"
            >
              {index + 1}
            </Button>
          ))}
        </CardBtnGroup>
      </CardHeader>
      <h4 className="px-2 text-lg font-medium text-muted-foreground">
        自由球員替換模式
      </h4>
      <Separator />
      <div className="flex flex-col gap-2 pt-2 text-xl">
        {!!liberoMode && !hasPairedMB && (
          <Alert variant="destructive">
            <FiAlertTriangle />
            <AlertTitle>無對位 MB</AlertTitle>
            <AlertDescription>
              陣容中未設定對位 MB，無法使用自動替換自由球員功能。
            </AlertDescription>
          </Alert>
        )}
        <Button
          variant={liberoMode === 0 ? "destructive" : "outline"}
          size="lg"
          onClick={() => handleLiberoMode(0)}
        >
          <FiX />
          手動替換
        </Button>
        <Button
          variant={liberoMode === 1 ? "default" : "outline"}
          size="lg"
          onClick={() => handleLiberoMode(1)}
          disabled={liberoCount < 1}
        >
          <FiCheck />
          自動替換
        </Button>
        {liberoMode === 0 ? (
          <Alert>
            <FiHelpCircle />
            <AlertTitle>手動替換自由球員</AlertTitle>
            <AlertDescription>
              記錄比賽過程中不會隨著輪轉自動替換自由球員，仍可以手動替換。
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <FiHelpCircle />
            <AlertTitle>自動替換自由球員</AlertTitle>
            <AlertDescription>
              記錄比賽過程中，當我方失分且該球是由我方 MB 進行發球時，自動將該名
              MB
              替換為第一位自由球員。且在自由球員即將輪轉至前排時，自動將自由球員更換為原先之
              MB。
            </AlertDescription>
            <AlertDescription className="text-destructive">
              使用此模式時，陣容中須有對位之 MB。
            </AlertDescription>
          </Alert>
        )}
      </div>
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
                    dispatch(lineupsActions.setOptionMode("substitutes"))
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
                <span className="flex-1">未入選名單 ({othersCount})</span>
                <Button
                  variant="link"
                  size="lg"
                  className="px-0 w-fit"
                  onClick={() =>
                    dispatch(lineupsActions.setOptionMode("substitutes"))
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
