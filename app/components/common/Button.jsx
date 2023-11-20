import styles from "./styles.module.scss";

export const ButtonContainer = ({ children, row }) => (
  <div
    className={`${styles.button__container} ${
      row && styles[`button__container--row`]
    }`}
  >
    {children}
  </div>
);

export const IconButton = ({ children, type, onClick, ariaLabel }) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.button__icon} ${
        type === "secondary" && styles["button__icon--secondary"]
      } ${type === "danger" && styles["button__icon--danger"]}`}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
