"use client";
import { usePathname, useRouter } from "next/navigation";

import styles from "./styles.module.scss";

import { Button } from "@/components/ui/button";
import { FiArrowLeft, FiBell } from "react-icons/fi";

const Container = ({ children }) => (
  <header className={styles.header}>{children}</header>
);

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const pathArr = pathname.split("/").filter(Boolean);
  const isIndex = pathArr.length <= 1;
  const handleBack = () => router.push(`/${pathArr[0]}`);

  return (
    <Container>
      {isIndex || (
        <Button onClick={handleBack} variant="ghost" size="icon">
          <FiArrowLeft />
        </Button>
      )}
      <h1
        className={`${styles.header__title} ${
          !isIndex && styles["header__title--center"]
        }`}
      >
        V-Stats
      </h1>
      <Button variant="ghost" size="icon">
        <FiBell />
      </Button>
    </Container>
  );
};
