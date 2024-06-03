import {
  FiHash,
  FiUser,
  FiUsers,
  FiMail,
  FiShield,
  FiEdit2,
} from "react-icons/fi";
import { Link } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MembersInfoTable = ({ team, member, className }) => {
  const contents = [
    { key: "隊伍", value: team?.name, icon: <FiUsers /> },
    { key: "背號", value: member?.number, icon: <FiHash /> },
    { key: "姓名", value: member?.name, icon: <FiUser /> },
    { key: "信箱", value: member?.meta?.email, icon: <FiMail /> },
    {
      key: "權限",
      value: member?.meta?.admin ? "管理者" : "一般成員",
      icon: <FiShield />,
    },
  ];
  const isAdmin = true;
  // TODO: 更新 admin 資料結構

  return (
    <Table className={className}>
      <TableHeader className="text-lg">
        <TableRow>
          <TableHead colSpan={2}>成員資訊</TableHead>
          <TableHead className="flex justify-end">
            {isAdmin && (
              <Link
                variant="ghost"
                href={`/team/${team._id}/members/${member._id}/edit`}
              >
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

export default MembersInfoTable;
