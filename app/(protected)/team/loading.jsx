import { Section } from "@/app/components/common/Section";
import {
  ListHeader,
  ListTitle,
  ListItem,
  ListItemText,
} from "@/app/components/common/List";

const Loading = () => {
  return (
    <Section>
      <ListHeader>
        <ListTitle />
      </ListHeader>
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
    </Section>
  );
};

export default Loading;
