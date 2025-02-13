import { RiHashtag, RiGroupLine } from "react-icons/ri";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const MembersInfoTable = ({ team, member, className }) => {
  const contents = [
    { key: "隊伍", value: team?.name, icon: <RiGroupLine /> },
    { key: "背號", value: member?.number, icon: <RiHashtag /> },
  ];

  return (
    <Table className={className}>
      <TableBody className="text-xl">
        {contents.map(({ key, value, icon }) => (
          <TableRow key={key}>
            <TableCell className="w-6 [&>svg]:size-6">
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

export default MembersInfoTable;
