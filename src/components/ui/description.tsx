import * as React from "react";

interface DescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Description = ({
  startIcon,
  endIcon,
  children,
  ...props
}: DescriptionProps) => {
  return (
    <div
      data-slot="Description"
      className="flex flex-row [&>svg]:size-6 gap-2 items-center basis-10 min-h-10"
      {...props}
    >
      {startIcon}
      <div className="flex flex-col flex-1">{children}</div>
      {endIcon}
    </div>
  );
};

interface DescriptionTitleProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const DescriptionTitle = ({ children }: DescriptionTitleProps) => {
  return (
    <p data-slot="DescriptionTitle" className="font-semibold">
      {children}
    </p>
  );
};

interface DescriptionContentProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const DescriptionContent = ({ children }: DescriptionContentProps) => {
  return (
    <p data-slot="DescriptionContent" className="text-muted-foreground">
      {children}
    </p>
  );
};

export { Description, DescriptionTitle, DescriptionContent };
