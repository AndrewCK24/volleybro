import { FiInfo, FiUsers } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TeamInfoTable = ({ team, className }) => {
  const contents = [
    { key: "簡稱", value: team.nickname, icon: <FiInfo /> },
    { key: "人數", value: team.members.length, icon: <FiUsers /> },
  ];

  return (
    <Table className={className}>
      <TableHeader className="text-lg">
        <TableRow>
          <TableHead colSpan={3}>隊伍資訊</TableHead>
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
            <TableCell className="w-full font-medium">{value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TeamInfoTable;
