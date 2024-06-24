import { Main } from "@/components/layout/Main";
import { Header } from "@/components/record/header";

const RecordLayout = ({ children }) => {
  return (
    <Main className="p-0 pb-4 overflow-hidden overscroll-y-none">
      <Header />
      {children}
    </Main>
  );
};

export default RecordLayout;
