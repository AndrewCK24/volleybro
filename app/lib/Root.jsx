"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { userActions } from "../(protected)/user/user-slice";
import { teamActions } from "../(protected)/team/team-slice";

const Root = ({ data }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const isSignIn = useSelector((state) => state.user.signIn);

  useEffect(() => {
    if (pathname.startsWith("/sign")) {
      document.body.style.backgroundColor = "rgba(var(--primary))";
    } else {
      document.body.style.backgroundColor = "rgba(var(--background))";
      if (!data && !isSignIn) router.push("/sign-in");
    }
  }, [pathname, data, isSignIn, router]);

  if (data && isSignIn === false) {
    const { userData, teamData, membersData } = data;
    dispatch(userActions.setUser(userData));
    dispatch(teamActions.setTeam({ userData, teamData, membersData }));
  }
};

export default Root;
