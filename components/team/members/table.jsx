import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiShield,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { HiArrowsUpDown } from "react-icons/hi2";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TeamMembersTable = ({ team, members, teamId }) => {
  const [sorting, setSorting] = useState(members);
  const router = useRouter();
  // FIXME: [Table] Column with id 'undefined' does not exist.
  // https://ui.shadcn.com/docs/components/data-table#update-column-definitions
  // https://tanstack.com/table/latest/docs/guide/column-defs
  const columns = [
    {
      id: "image",
      header: () => <FiUser />,
      cell: () => <FiUser />,
      size: 32,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "number",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="lg"
            className="gap-0 svg-[1rem]"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            No.
            <HiArrowsUpDown className="w-4 h-4 ml-2" />
          </Button>
        );
      },
      size: 52,
    },
    {
      accessorKey: "name",
      header: "姓名",
    },
    {
      id: "role",
      header: "狀態",
      cell: ({ row }) => {
        const memberId = row.original._id;
        const member = team.members.find((m) => m._id === memberId);
        const { role, user_id, email } = member;
        const isAdmin = !!role;
        const identity = !email
          ? {
              text: "未邀請",
              type: "secondary",
              icon: <FiXCircle />,
            }
          : !user_id
          ? {
              text: "邀請中",
              type: "outline",
              icon: <FiClock />,
            }
          : isAdmin
          ? {
              text: "管理者",
              type: "destructive",
              icon: <FiShield />,
            }
          : {
              text: "已加入",
              type: "default",
              icon: <FiCheckCircle />,
            };

        return (
          <Badge variant={identity.type} className="!svg-[1rem]">
            {identity.icon} {identity.text}
          </Badge>
        );
      },
      enableResizing: false,
      size: 96,
    },
  ];
  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <Table className="text-lg">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  style={{ width: `${header.getSize()}px` }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              onClick={() =>
                router.push(`/team/${teamId}/members/${row.original._id}`)
              }
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TeamMembersTable;
