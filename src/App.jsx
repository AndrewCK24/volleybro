import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/Root";
import { jwtLoader } from "./utils/auth";
import AuthPage, { action as authAction } from "./pages/Auth";
import TeamPage from "./pages/Team";
import TeamMembersPage from "./pages/TeamMembers";
import TeamListPage from "./pages/TeamList";
import { action as teamAction } from "./components/team/MemberCard";
import RecordPage from "./pages/Record";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    id: "root",
    loader: jwtLoader,
    children: [
      // {
      //   index: true,
      //   element:
      // },
      {
        path: "auth",
        element: <AuthPage />,
        action: authAction,
        // loader: authLoader,
      },
      {
        path: "team",
        element: <TeamPage />,
        action: teamAction,
        children: [
          {
            index: true,
            element: <TeamMembersPage />,
            action: teamAction,
          },
          {
            path: "list",
            element: <TeamListPage />,
          },
          // {
          //   path: "new",
          //   element: < />,
          // }
        ],
      },
      {
        path: "record",
        element: <RecordPage />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
