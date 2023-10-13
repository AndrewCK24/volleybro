const Dashboard = () => {
  return (
    <div>
      <div>Dashboard</div>
    </div>
  );
};

export default Dashboard;

export const loader = () => {
  store.dispatch({ type: "root/setTitle", payload: "首頁" });
  return null;
};