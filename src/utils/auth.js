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
