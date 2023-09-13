export const getJwtInfo = async () => {
  try {
    const response = await fetch("/.netlify/functions/fetch-user-by-jwt", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      credentials: "include",
    });
    const { status, userData, teamData } = await response.json();

    return { status, userData, teamData };
  } catch (error) {
    return { status: 400, userData: null };
  }
};
