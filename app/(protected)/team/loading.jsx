import { Card } from "@/components/ui/card";
import { ListItem, ListItemText } from "@/app/components/common/List";

const Loading = () => {
  return (
    <Card className="w-full">
      <div className="flex flex-col gap-2 animate-pulse">
        <div className="h-12" />
        <ListItem>
          <ListItemText minimized={true} />
          <ListItemText minimized={true} />
          <ListItemText />
        </ListItem>
        <ListItem>
          <ListItemText minimized={true} />
          <ListItemText minimized={true} />
          <ListItemText />
        </ListItem>
        <ListItem />
      </div>
    </Card>
  );
};

export default Loading;
