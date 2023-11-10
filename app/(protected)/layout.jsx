import { cookies } from "next/headers";
import Root from "../components/layout/Root";
import { Header } from "../components/layout/Header";
import { Main } from "../components/layout/Main";
import { Nav } from "../components/layout/Nav";

const getAuthData = async () => {
  const cookieStore = cookies();
  const cookie = cookieStore.get("token");
  const token = cookie ? cookie.value : "";
  if (!cookie || !token) return null;

  const response = await fetch(process.env.URL + "/api/sign-in", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      cookie: `token=${token}`,
    },
    next: { revalidate: 60 },
  });
  const data = await response.json();
  if (data.error) return null;

  return data;
};

const ProtectedLayout = async ({ children }) => {
  const data = await getAuthData();

  return (
    <>
      <Root data={data} />
      <Main>{children}</Main>
      <Header />
      <Nav />
    </>
  );
}

export default ProtectedLayout;