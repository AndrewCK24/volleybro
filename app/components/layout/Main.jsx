import styles from "./styles.module.scss";

export const Main = ({ children, full, noGap }) => {
  return (
    <main
      className={`
        ${styles.main} 
        ${full && styles[`main--full-height`]} 
        ${noGap && styles[`main--no-gap`]}
      `}
    >
      {children}
    </main>
  );
};
