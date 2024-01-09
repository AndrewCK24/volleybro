import styles from "./styles.module.scss";

export const Main = ({ children, full, halfGap, noGap }) => {
  return (
    <main
      className={`
        ${styles.main} 
        ${full && styles[`main--full-height`]} 
        ${halfGap && styles[`main--half-gap`]} 
        ${noGap && styles[`main--no-gap`]}
      `}
    >
      {children}
    </main>
  );
};
