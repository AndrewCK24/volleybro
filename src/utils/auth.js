import store from "../store/store";
import { userActions } from "../components/user/user-slice";

export const jwtLoader = async ({ request }) => {
  console.log("loader started");
  const isLogin = store.getState().user.login;
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

    // FIXME: 自動跳轉功能需要修復
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
