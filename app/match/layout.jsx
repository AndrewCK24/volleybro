import Header from "./Header";
import { Main } from "../components/layout/Main";

const RecordLayout = ({ children }) => {
  return (
    <>
      <Main full halfGap>
        <Header />
        {children}
      </Main>
    </>
  );
};

export default RecordLayout;
