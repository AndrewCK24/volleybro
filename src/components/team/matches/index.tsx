"use client";
import { useRouter } from "next/navigation";
import { useTeamRecords } from "@/hooks/use-data";
import { FiChevronRight } from "react-icons/fi";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import LoadingCard from "@/components/custom/loading/card";

const TeamMatches = ({
  teamId,
  className,
}: {
  teamId: string;
  className?: string;
}) => {
  const router = useRouter();
  const { records, isLoading } = useTeamRecords(teamId);

  if (isLoading) return <LoadingCard className={className} />;

  return (
    <Card className={className}>
      <Table>
        <TableBody className="text-xl">
          {records.length ? (
            records.map((record) => {
              return (
                <TableRow
                  key={record._id}
                  onClick={() => router.push(`/record/${record._id}`)}
                >
                  <TableCell>
                    <div className="flex flex-row items-center">
                      <span className="flex-1">
                        {record.info.name || "比賽"}
                      </span>
                      <FiChevronRight />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell>沒有比賽</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default TeamMatches;
