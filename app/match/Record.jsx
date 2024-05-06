import { cn } from "@/lib/utils";
import { FiPlus, FiMinus } from "react-icons/fi";
import { recordTypes } from "@/app/lib/record-types";

const Container = ({ children, onClick }) => {
  return (
    <div
      className="flex flex-row items-center justify-start flex-none w-full gap-1 basis-8"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const Score = ({ children, win = false }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center flex-none",
        "basis-8 w-8 h-8 bg-accent text-[1.5rem] rounded-[0.5rem] font-semibold",
        win && "bg-primary text-primary-foreground"
      )}
    >
      {children}
    </div>
  );
};

const RecordText = ({ children, editing }) => (
  <p
    className={cn(
      "flex flex-row flex-1 text-[1.5rem] gap-2 px-2 max-w-[calc(100%-9rem)] border-l-[0.125rem] border-primary",
      editing && "animate-pulse duration-1000"
    )}
  >
    {children}
  </p>
);

const Number = ({ children }) => (
  <span className="text-[1.5rem] font-semibold">{children}</span>
);

const IconWin = () => <FiPlus className="w-6 h-6 text-primary stroke-[3px]" />;

const IconLose = () => (
  <FiMinus className="w-6 h-6 text-destructive stroke-[3px]" />
);

const Record = ({ record, players, editingItem, onClick }) => {
  const { win, ours, oppo } = record;
  const oursType = recordTypes[ours.num];
  const oppoType = recordTypes[oppo.num];

  return (
    <Container onClick={onClick}>
      {ours.type ? (
        <>
          <Score win={win}>{ours.score}</Score>
          <Score win={!win}>{oppo.score}</Score>
        </>
      ) : (
        <>
          <Score>{ours.score}</Score>
          <Score>{oppo.score}</Score>
        </>
      )}
      <RecordText editing={editingItem === "ours"}>
        {ours.type ? (
          ours.type === "oppo-error" ? (
            <>
              對方失誤
              <IconWin />
            </>
          ) : (
            <>
              <Number>{players[ours.player]?.number}</Number>
              {oursType?.text}
              {ours.type && (win ? <IconWin /> : <IconLose />)}
            </>
          )
        ) : (
          <Number>{players[ours.player]?.number}</Number>
        )}
      </RecordText>
      <RecordText editing={editingItem === "oppo"}>
        {oppo.type &&
          (oppo.type === "oppo-error" ? (
            <>
              我方失誤
              <IconWin />
            </>
          ) : (
            <>
              對方{oppoType?.text}
              {win ? <IconLose /> : <IconWin />}
            </>
          ))}
      </RecordText>
    </Container>
  );
};

export default Record;
