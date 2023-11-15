import { Section } from "@/app/components/common/Section";
import { ListItem, ListItemText } from "@/app/components/common/List";

const Loading = () => {
  return (
    <>
      <Section>
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
      </Section>
      <Section transparent={true}>
        <ListItem />
      </Section>
    </>
  );
};

export default Loading;
