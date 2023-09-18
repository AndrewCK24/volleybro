import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";

import { theme } from "./theme";
import RootLayout, { loader as infoLoader } from "./pages/Root";
import RootNavLayout from "./pages/RootNav";
import Dashboard from "./pages/DashBoard";
import AuthPage, {
  loader as authLoader,
  action as authAction,
} from "./pages/Auth";
import TeamPage from "./pages/Team";
import TeamMembersPage from "./pages/TeamMembers";
import TeamListPage from "./pages/TeamList";
import TeamCreatePage, { action as teamCreateAction } from "./pages/TeamCreate";
import { action as memberEditAction } from "./components/team/MemberCard";
import MenuPage from "./components/user/Menu";
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
            // loader: teamLoader,
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
          {
            path: "user",
            element: <MenuPage />,
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
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
