import { cn } from "@/lib/utils";

export const Main = ({ children, className, ...props }) => {
  return (
    <main
      className={cn(
        "flex-1 pt-[3.5rem] px-0 pb-[4.5rem] flex flex-col justify-start items-center gap-2 flex-nowrap overflow-scroll overscroll-y-contain z-0 bg-accent md:max-xl:px-[5%] md:max-xl:py-16 transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </main>
  );
};
