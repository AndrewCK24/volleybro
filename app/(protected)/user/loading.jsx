import { Card } from "@/components/ui/card";
import { ListItem, ListItemText } from "@/app/components/common/List";

const Loading = () => {
  return (
    <>
      <Card className="w-full">
        <ListItem />
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
      </Card>
      <Card className="w-full py-0 bg-transparent shadow-none">
        <ListItem />
      </Card>
    </>
  );
};

export default Loading;
