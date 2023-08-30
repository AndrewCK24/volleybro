import { redirect } from "react-router-dom";

export const jwtLoader = async () => {
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
      case 201:
        return redirect("/team/new");
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
