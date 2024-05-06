import styles from "./styles.module.scss";

export const ListItem = ({
  children,
  type = "",
  center,
  onClick = null,
  disabled = false,
  text = false,
  div = false,
}) => {
  if (div) {
    return (
      <div
        className={`
          ${styles.list__item} 
          ${styles[`list__item${type && `--${type}`}${text ? `-text` : ""}`]} 
          ${center && styles[`list__item--center`]}
        `}
        disabled={true}
      >
        {children}
      </div>
    );
  } else {
    return (
      <button
        className={`
          ${styles.list__item} 
          ${styles[`list__item${type && `--${type}`}${text ? `-text` : ""}`]} 
          ${center && styles[`list__item--center`]}
        `}
        onClick={onClick}
        disabled={!onClick || disabled}
      >
        {children}
      </button>
    );
  }
};

export const ListItemText = ({ children, minimized, bold, fit }) => {
  return (
    <div
      className={`
        ${styles.list__item_text} 
        ${minimized && styles[`list__item_text--minimized`]} 
        ${bold && styles[`list__item_text--bold`]} 
        ${fit && styles[`list__item_text--fit`]}
      `}
    >
      {children}
    </div>
  );
};

// TODO: 將 ListItemDetailContent 簡化為 ListItemContent
// export const ListItemDetailContent = ({ detail, children }) => {
//   const Container = styled.div`
//     flex: 1 1;
//     height: 3rem;
//     display: flex;
//     flex-direction: column;
//     align-items: left;
//     justify-content: center;
//     gap: 0.25rem;
//   `;

//   const StyledContent = styled(ListItemText)`
//     flex: 0 0 1.5rem;
//     width: 100%;
//     height: 1.5rem;
//     justify-content: flex-start;
//     line-height: 1.5rem;
//   `;

//   const StyledDetail = styled(ListItemText)`
//     flex: 0 0 1rem;
//     width: 100%;
//     height: 1rem;
//     justify-content: flex-start;
//     font-size: 1rem;
//     line-height: 1rem;
//     color: var(--primary-600);
//   `;

//   return (
//     <Container>
//       <StyledContent>{children}</StyledContent>
//       <StyledDetail>{detail}</StyledDetail>
//     </Container>
//   );
// };
