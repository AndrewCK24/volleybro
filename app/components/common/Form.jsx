import Link from "next/link";
import styles from "./styles.module.scss";

export const FormContainer = ({ children, type }) => {
  return (
    <div
      className={`${styles.form__container} ${
        type === "minimized" && styles[`styles__container--minimized`]
      }`}
    >
      {children}
    </div>
  );
};

export const FormTitle = ({ children }) => {
  return <h2 className={styles.form__title}>{children}</h2>;
};

export const FormContents = ({ children, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className={styles.form__contents}>
      {children}
    </form>
  );
};

export const FormControl = (props) => {
  const {
    name,
    labelText,
    type = "text",
    defaultValue = "",
    placeholder = "",
    required = false,
    disabled = false,
    warn = "",
    ref,
    onChange,
    autoComplete = "on",
  } = props;

  return (
    <div className={styles.form__inputContainer}>
      <div className={styles.form__labelGroup}>
        <label
          className={
            required ? styles[`form__label--required`] : styles.form__label
          }
          htmlFor={name}
        >
          {labelText}
        </label>
        <span className={styles.form__helper}>{warn}</span>
      </div>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        id={name}
        name={name}
        required={required}
        disabled={disabled}
        ref={ref}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className={`${styles.form__input} ${
          !warn || warn === " " || styles["form__input--danger"]
        }`}
      />
    </div>
  );
};

// const FormRadioInput = styled.input`
//   display: none;
//   &:disabled ~ label {
//     border-color: var(--primary-500);
//     color: var(--primary-500);
//   }
//   &:checked ~ label {
//     background-color: var(--secondary-600);
//     color: var(--primary-100);
//   }
//   &:checked:disabled ~ label {
//     background-color: var(--primary-500);
//   }
// `;

export const FormSelect = (props) => {
  const {
    name,
    labelText,
    options = [],
    required = false,
    defaultValue = "",
    disabled = false,
    warn = "",
    onChange,
  } = props;

  return (
    <div className={styles.form__inputContainer}>
      <div className={styles.form__labelGroup}>
        <label
          className={
            required ? styles[`form__label--required`] : styles.form__label
          }
        >
          {labelText}
          <span className={styles.form__helper}>{warn}</span>
        </label>
      </div>
      <div className={styles.form__radioSet}>
        {options.map((option, index) => {
          const { id, value, text } = option;
          return (
            <div className={styles.form__radioGroup} key={index}>
              <input
                className={styles.form__radioInput}
                key={id}
                type="radio"
                id={id}
                name={name}
                value={value}
                disabled={disabled}
                defaultChecked={defaultValue === value}
              />
              <label
                className={styles.form__radioLabel}
                key={index}
                htmlFor={id}
              >
                {text}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const FormButton = ({ children, errorArr = [], type, onClick }) => {
  const hasError = errorArr.some((error) => error);

  return (
    <button
      type="submit"
      disabled={hasError}
      className={`${styles.form__button} ${styles[`form__button--${type}`]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const FormLink = ({ children, href }) => {
  return (
    <div className={styles.form__link}>
      <Link href={href}>{children}</Link>
    </div>
  );
};

export const FormHr = ({ content }) => {
  return <hr className={styles.form__hr} content={content} />;
};
