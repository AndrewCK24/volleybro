import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout, { loader as infoLoader } from "./pages/Root";
import RootNavLayout from "./pages/RootNav";
import Dashboard from "./pages/DashBoard";
import AuthPage, {
  loader as authLoader,
  action as authAction,
} from "./pages/Auth";
import TeamPage, { loader as teamLoader } from "./pages/Team";
import TeamMembersPage from "./pages/TeamMembers";
import TeamListPage from "./pages/TeamList";
import TeamCreatePage, { action as teamCreateAction } from "./pages/TeamCreate";
import { action as memberEditAction } from "./components/team/MemberCard";
import RecordPage from "./pages/Record";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    id: "root",
    loader: infoLoader,
    children: [
      {
        path: "/",
        element: <RootNavLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "team",
            element: <TeamPage />,
            loader: teamLoader,
            action: memberEditAction,
            children: [
              {
                index: true,
                element: <TeamMembersPage />,
              },
              {
                path: "list",
                element: <TeamListPage />,
              },
              {
                path: "new",
                element: <TeamCreatePage />,
                action: teamCreateAction,
              },
            ],
          },
        ],
      },
      {
        path: "record",
        element: <RecordPage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthPage />,
    action: authAction,
    loader: authLoader,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
