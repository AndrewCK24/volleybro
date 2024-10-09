import { Main } from "@/components/layout/main";

const RecordLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Main className="p-0 overflow-hidden overscroll-y-none">{children}</Main>
  );
};

export default RecordLayout;
