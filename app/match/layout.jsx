import { Main } from "../components/layout/Main";
import Header from "./Header";

const MatchLayout = ({ children }) => {
  return (
    <Main full halfGap>
      <Header />
      {children}
    </Main>
  );
};

export default MatchLayout;
