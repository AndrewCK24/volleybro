import styles from "./styles.module.scss";

const Logo = ({ type }) => (
  <div
    className={`${styles.logo} ${
      type === "maximized" && styles["logo--maximized"]
    }`}
  >
    V-STATS
  </div>
);

export default Logo;
