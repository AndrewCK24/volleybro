import styles from "./styles.module.scss";

export const Section = ({ children, type }) => {
  return (
    <section className={`${styles.section} ${styles[`section--${type}`]}`}>
      {children}
    </section>
  );
};

export const SectionHr = ({ content }) => {
  return <hr className={styles.section__hr} content={content} />;
};
