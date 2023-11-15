"use client";
import { usePathname } from "next/navigation";

import styles from "./styles.module.scss";

import { IconButton } from "../common/Button";
import { FiArrowLeft } from "react-icons/fi";
import { IoNotificationsSharp } from "react-icons/io5";

const Container = ({ children }) => (
  <header className={styles.header}>{children}</header>
);

export const Header = () => {
  const pathname = usePathname();
  const isIndex = pathname.split("/").filter(Boolean).length <= 1;
  const handleBack = () => {
    window.history.back();
  };

  return (
    <Container>
      {isIndex || (
        <IconButton onClick={handleBack} type="secondary">
          <FiArrowLeft />
        </IconButton>
      )}
      <h1
        className={`${styles.header__title} ${
          !isIndex && styles["header__title--center"]
        }`}
      >
        V-Stats
      </h1>
      <IoNotificationsSharp />
    </Container>
  );
};
