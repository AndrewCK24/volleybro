import store from "../store";
import { Court } from "../components/common/Court";

const TeamLineupPage = () => {
  return (
    <>
      <Court />
    </>
  );
};

export default TeamLineupPage;

export const loader = () => {
  store.dispatch({ type: "root/setTitle", payload: "預設陣容" });
  return null;
};
