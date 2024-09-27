import { Main } from "@/src/components/layout/main";

const RecordLayout = ({ children }) => {
  return (
    <Main className="p-0 overflow-hidden overscroll-y-none">{children}</Main>
  );
};

export default RecordLayout;
