export const Description = ({ startIcon, endIcon, children, ...props }) => {
  return (
    <div
      className="flex flex-row [&>svg]:w-6 [&>svg]:h-6 gap-2 items-center basis-10 min-h-10"
      {...props}
    >
      {startIcon}
      <div className="flex flex-col flex-1">{children}</div>
      {endIcon}
    </div>
  );
};

export const DescriptionTitle = ({ children }) => {
  return <p className="font-semibold">{children}</p>;
};

export const DescriptionContent = ({ children }) => {
  return <p className="text-muted-foreground">{children}</p>;
};
