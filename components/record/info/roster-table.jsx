import { FiHash } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ListBadge = ({ list }) => {
  if (list === "substitutes") return null;

  return (
    <Badge variant={list === "starting" ? "" : "destructive"}>
      {list === "starting" ? "先發" : "自由"}
    </Badge>
  );
};

const RoasterTable = ({ roaster }) => {
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
        {roaster.map((player) => (
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

export default RoasterTable;
