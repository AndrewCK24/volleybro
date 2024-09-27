import { FiInfo, FiUsers, FiEdit2 } from "react-icons/fi";
import { Link } from "@/src/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

const TeamInfoTable = ({ team, className }) => {
  const contents = [
    { key: "簡稱", value: team.nickname, icon: <FiInfo /> },
    { key: "人數", value: team.members.length, icon: <FiUsers /> },
  ];
  const isAdmin = true;
  // TODO: 更新 admin 資料結構

  return (
    <Table className={className}>
      <TableHeader className="text-lg">
        <TableRow>
          <TableHead colSpan={2}>隊伍資訊</TableHead>
          <TableHead className="flex justify-end">
            {isAdmin && (
              <Link variant="ghost" href={`/team/${team._id}/edit`}>
                <FiEdit2 />
              </Link>
            )}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-xl">
        {contents.map(({ key, value, icon }) => (
          <TableRow key={key}>
            <TableCell className="w-6 [&>svg]:w-6 [&>svg]:h-6">
              {icon}
            </TableCell>
            <TableCell className="text-nowrap text-muted-foreground">
              {key}
            </TableCell>
            <TableCell className="w-full font-medium" colSpan={2}>
              {value}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TeamInfoTable;
