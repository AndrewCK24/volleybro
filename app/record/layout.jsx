import { Main } from "@/components/layout/Main";

const RecordLayout = ({ children }) => {
  return (
    <Main className="p-0 overflow-hidden overscroll-y-none">
      {children}
    </Main>
  );
};

export default RecordLayout;
