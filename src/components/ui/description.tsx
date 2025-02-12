import * as React from "react";

interface DescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Description = React.forwardRef<HTMLDivElement, DescriptionProps>(
  ({ startIcon, endIcon, children, ...props }, ref) => {
    return (
      <div
        className="flex flex-row [&>svg]:size-6 gap-2 items-center basis-10 min-h-10"
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

interface DescriptionTitleProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const DescriptionTitle = React.forwardRef<
  HTMLParagraphElement,
  DescriptionTitleProps
>(({ children }, ref) => {
  return (
    <p className="font-semibold" ref={ref}>
      {children}
    </p>
  );
});
DescriptionTitle.displayName = "DescriptionTitle";

interface DescriptionContentProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const DescriptionContent = React.forwardRef<
  HTMLParagraphElement,
  DescriptionContentProps
>(({ children }, ref) => {
  return (
    <p className="text-muted-foreground" ref={ref}>
      {children}
    </p>
  );
});
DescriptionContent.displayName = "DescriptionContent";
