import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";

/** A tappable list row in a player or position picker. */
export const PickerRow = ({
  number,
  label,
  icon,
  pressed,
  disabled,
  onClick,
}: {
  number?: React.ReactNode;
  label: React.ReactNode;
  icon?: React.ReactNode;
  /** Set only for rows that show a current selection. */
  pressed?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) => (
  <Item asChild variant="outline">
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <ItemMedia>{icon}</ItemMedia>}
      <ItemMedia className="basis-8 justify-end text-xl font-semibold">
        {number || " "}
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-xl">{label}</ItemTitle>
      </ItemContent>
    </button>
  </Item>
);
