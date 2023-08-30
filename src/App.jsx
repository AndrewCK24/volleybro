import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/Root";
import { jwtLoader } from "./utils/auth";
import AuthPage, {
  // loader as authLoader,
  action as authAction,
} from "./pages/Auth";
import MembersPage from "./pages/Team";
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
        element: <MembersPage />,
        action: teamAction,
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
