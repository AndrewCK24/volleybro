"use client";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { userActions } from "../../(protected)/user/user-slice";
import { teamActions } from "../../(protected)/team/team-slice";

const Root = ({ data }) => {
  console.log("Root, render");
  const router = useRouter();
  const dispatch = useDispatch();
  const isSignIn = useSelector((state) => state.user.signIn);

  if (!data) {
    router.push("/sign-in");
  } else if (!isSignIn) {
    const { userData, teamData, membersData } = data;
    dispatch(userActions.setUser(userData));
    dispatch(teamActions.setTeam({ teamData, membersData }));
  }

  return <></>;
};

export default Root;
