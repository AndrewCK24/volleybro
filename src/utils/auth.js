import { redirect } from "react-router-dom";
import store from "../store/store";

export const getJwtInfo = async () => {
  try {
    const response = await fetch("/.netlify/functions/validate-jwt", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      credentials: "include",
    });
    const { status, userData } = await response.json();

    return { status, userData };
  } catch (error) {
    return { status: 400, userData: null };
  }
};

export const authLoader = async () => {
  const isSignIn = store.getState().user.signIn;
  if (isSignIn) {
    const teamIds = store.getState().user.info.teamIds;
    if (teamIds.length > 0) {
      return redirect("/");
    } else {
      return redirect("/team/new");
    }
  } else {
    return null;
  }
};
