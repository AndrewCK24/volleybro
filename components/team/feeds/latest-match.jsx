import { FiChevronRight, FiClock } from "react-icons/fi";
import { Link } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBtnGroup,
} from "@/components/ui/card";

const LatestMatch = ({ teamId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <FiClock />
          近期比賽表現
        </CardTitle>
        <CardBtnGroup>
          <Link variant="link" size="lg" href={`/team/${teamId}/matches`}>
            查看更多
            <FiChevronRight />
          </Link>
        </CardBtnGroup>
      </CardHeader>
    </Card>
  );
};

export default LatestMatch;
