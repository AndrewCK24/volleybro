import { auth } from "@/auth";
import { NavLinks } from "@/components/layout/nav/links";

export const Nav = async () => {
  const session = await auth();

  return <NavLinks session={session} />;
};
