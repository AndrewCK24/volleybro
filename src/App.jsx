import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";

import { theme } from "./theme";
import RootLayout, { loader as infoLoader } from "./pages/Root";
import RootNavLayout from "./pages/RootNav";
import Dashboard from "./pages/DashBoard";
import AuthPage, {
  loader as authLoader,
} from "./pages/Auth";
import SignInForm, {
  action as signInAction,
} from "./components/auth/SignInForm";
import SignUpForm, {
  action as signUpAction,
} from "./components/auth/SignUpForm";
import TeamPage from "./pages/Team";
import TeamMembersPage from "./pages/TeamMembers";
import TeamListPage from "./pages/TeamList";
import TeamCreatePage, {
  action as teamCreateAction,
} from "./components/team/TeamEdit";
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
            // children: [
            //   {
            //     index: true,
            //     element: <MenuPage />,
            //   },
            //   {
            //     path: "edit",
            //     element: <UserEditPage />,
            //   }
            // ],
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
    children: [
      {
        index: true,
        element: <SignInForm />,
        action: signInAction,
      },
      {
        path: "sign-up",
        element: <SignUpForm />,
        action: signUpAction,
      },
    ],
    // action: authAction,
    // loader: authLoader,
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
