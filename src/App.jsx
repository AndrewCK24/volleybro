import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";

import { theme } from "./theme";
import RootLayout, { loader as infoLoader } from "./pages/Root";

import AuthPage, { loader as authLoader } from "./pages/Auth";
import SignInForm, {
  action as signInAction,
} from "./components/auth/SignInForm";
import SignUpForm, {
  action as signUpAction,
} from "./components/auth/SignUpForm";

import Dashboard from "./pages/DashBoard";

import TeamPage from "./pages/Team";
import TeamMembersPage, {
  loader as teamMembersLoader,
} from "./views/TeamMembers";
import TeamInvitationsPage, {
  loader as teamInvitationsLoader,
} from "./views/TeamInvitations";
import TeamLineupPage, { loader as teamLineupLoader } from "./views/TeamLineup";
import TeamInfo, {
  loader as teamInfoLoader,
  teamCreateAction,
  teamInfoUpdateAction,
} from "./views/TeamInfo";
import { action as memberEditAction } from "./components/team/MemberCard";

import MenuPage, { loader as MenuLoader } from "./pages/Menu";

import RecordPage from "./pages/Record";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    id: "root",
    loader: infoLoader,
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
            loader: teamMembersLoader,
          },
          {
            path: "invitations",
            element: <TeamInvitationsPage />,
            loader: teamInvitationsLoader,
          },
          {
            path: "lineup",
            element: <TeamLineupPage />,
            loader: teamLineupLoader,
          },
          {
            path: ":id",
            element: <TeamInfo />,
            loader: teamInfoLoader,
            action: teamInfoUpdateAction,
          },
          {
            path: "new",
            element: <TeamInfo />,
            loader: teamInfoLoader,
            action: teamCreateAction,
          },
        ],
      },
      {
        path: "user",
        element: <MenuPage />,
        loader: MenuLoader,
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
        loader: authLoader,
      },
      {
        path: "sign-up",
        element: <SignUpForm />,
        action: signUpAction,
      },
    ],
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
