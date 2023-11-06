import styles from "./styles.module.scss";

import { IconButton } from "../common/Button";
import { FiArrowLeft } from "react-icons/fi";
import { IoNotificationsSharp } from "react-icons/io5";

const Container = ({ children }) => (
  <header className={styles.header}>{children}</header>
);

const Title = ({ children, center }) => {
  return (
    <h1
      className={`${styles.header__title} ${
        center && styles["header__title--center"]
      }`}
    >
      {children}
    </h1>
  );
};

const Header = ({ title, isIndex }) => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <Container>
      {isIndex || (
        <IconButton onClick={handleBack} className="secondary">
          <FiArrowLeft />
        </IconButton>
      )}
      <Title center={!isIndex}>{title}</Title>
      <IoNotificationsSharp />
    </Container>
  );
};

export default Header;
