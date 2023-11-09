import styles from "./styles.module.scss";

export const Main = ({ children, full }) => {
  return (
    <main className={`${styles.main} ${full && styles[`main--full-height`]}`}>
      {children}
    </main>
  );
};
