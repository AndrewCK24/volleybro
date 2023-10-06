import store from "../store";

const TeamLineupPage = () => {
  return <></>;
};

export default TeamLineupPage;

export const loader = () => {
  store.dispatch({ type: "root/setTitle", payload: "預設陣容" });
  return null;
};
