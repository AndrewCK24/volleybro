import styles from "./styles.module.scss";

export const Section = ({ children, type }) => {
  return (
    <section className={`${styles.section} ${styles[`section--${type}`]}`}>
      {children}
    </section>
  );
};
