import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/Root";
import AuthPage, {
  // loader as authLoader,
  action as authAction,
} from "./pages/Auth";
import MembersPage from "./pages/Team";
import { action as teamAction } from "./components/team/MemberCard";
import RecordPage from "./pages/Record";

const jwtLoader = async ({ request }) => {
  console.log("loader started");
  try {
    const response = await fetch("/.netlify/functions/validate-jwt", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      credentials: "include",
    });
    const { status } = await response.json();

    switch (status) {
      case 200:
        return null;
      case 400:
      case 401:
        return redirect("/auth");
      default:
        return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

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
