import { FiHash } from "react-icons/fi";
import { Badge } from "@/src/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

import type { TableRosterPlayer } from "@/src/lib/features/record/types";

const ListBadge = ({ list }: { list: string }) => {
  if (list === "substitutes") return null;

  return (
    <Badge variant={list === "starting" ? "default" : "destructive"}>
      {list === "starting" ? "先發" : "自由"}
    </Badge>
  );
};

const RosterTable = ({ roster }: { roster: TableRosterPlayer[] }) => {
  return (
    <Table>
      <TableHeader className="text-lg">
        <TableRow>
          <TableHead className="w-10">
            <FiHash />
          </TableHead>
          <TableHead>姓名</TableHead>
          <TableHead className="w-16"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-xl">
        {roster.map((player) => (
          <TableRow key={player._id}>
            <TableCell>{player.number}</TableCell>
            <TableCell>{player.name}</TableCell>
            <TableCell>
              <ListBadge list={player.list} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RosterTable;
