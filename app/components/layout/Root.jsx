"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.scss";

import { userActions } from "../../user/user-slice";
import { teamActions } from "../../team/team-slice";
import { FiEdit } from "react-icons/fi";
import Header from "./Header";
import Nav from "./Nav";

const Main = ({ children, full }) => {
  return (
    <main className={`${styles.main} ${full && styles[`main--full-height`]}`}>
      {children}
    </main>
  );
};

const RecordBtn = () => (
  <Link href="/record" className={styles.recordBtn}>
    <FiEdit />
    開始紀錄
  </Link>
);

const Root = ({ data, children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const pathArr = pathname.split("/").filter(Boolean);
  const isIndex = pathArr.length <= 1;
  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";
  const isSignIn = useSelector((state) => state.user.signIn);

  useEffect(() => {
    if (!data) {
      if (pathname !== "/sign-in") router.push("/sign-in");
    } else if (!isSignIn) {
      const { userData, teamData, membersData } = data;
      console.log("userData", userData);
      dispatch(userActions.setUser(userData));
      dispatch(teamActions.setTeam({ teamData, membersData }));
      // router.push("/");
    }
  }, []);

  return isAuthPage ? (
    <Main full={true}>{children}</Main>
  ) : (
    <>
      <Header title="V-Stats" isIndex={isIndex} />
      <Main>{children}</Main>
      {isIndex && <RecordBtn />}
      <Nav pathname={pathname} />
    </>
  );
};

export default Root;
