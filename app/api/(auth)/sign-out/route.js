import { NextResponse } from "next/server";

export const POST = async (req) => {
  const response = NextResponse.json(
    { message: "Sign out success" },
    { status: 200 }
  );
  response.cookies.set({
    name: "token",
    value: "",
    options: {
      httpOnly: true,
      maxAge: 0,
    },
  });
  return response;
};
