import * as React from "react";

export const Description = React.forwardRef(
  ({ startIcon, endIcon, children, ...props }, ref) => {
    return (
      <div
        className="flex flex-row [&>svg]:w-6 [&>svg]:h-6 gap-2 items-center basis-10 min-h-10"
        ref={ref}
        {...props}
      >
        {startIcon}
        <div className="flex flex-col flex-1">{children}</div>
        {endIcon}
      </div>
    );
  }
);
Description.displayName = "Description";

export const DescriptionTitle = React.forwardRef(({ children }, ref) => {
  return (
    <p className="font-semibold" ref={ref}>
      {children}
    </p>
  );
});
DescriptionTitle.displayName = "DescriptionTitle";

export const DescriptionContent = React.forwardRef(({ children }, ref) => {
  return (
    <p className="text-muted-foreground" ref={ref}>
      {children}
    </p>
  );
});
DescriptionContent.displayName = "DescriptionContent";
