import { Main } from "@/components/layout/Main";
import { Header } from "@/components/match/header";

const RecordLayout = ({ children }) => {
  return (
    <Main className="p-0 overflow-hidden overscroll-y-none">
      <Header />
      {children}
    </Main>
  );
};

export default RecordLayout;
