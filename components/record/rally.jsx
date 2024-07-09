import { cn } from "@/lib/utils";
import { FiPlus, FiMinus } from "react-icons/fi";
import { rallyOutcomes } from "@/lib/rally-outcomes";

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
      "flex flex-row flex-1 text-[1.5rem] gap-1 px-2 max-w-[calc(100%-9rem)] border-l-[0.125rem] border-primary",
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

const Rally = ({ rally, players, editingItem, onClick }) => {
  const { win, home, away } = rally;
  const oursType = rallyOutcomes[home.num];
  const oppoType = rallyOutcomes[away.num];
  const playerNumber = players.find((p) => p._id === home.player)?.number;

  return (
    <div
      className="flex flex-row items-center justify-start flex-none w-full gap-1 basis-8"
      onClick={onClick}
    >
      {home.type ? (
        <>
          <Score win={win}>{home.score}</Score>
          <Score win={!win}>{away.score}</Score>
        </>
      ) : (
        <>
          <Score>{home.score}</Score>
          <Score>{away.score}</Score>
        </>
      )}
      <RecordText editing={editingItem === "ours"}>
        {home.type ? (
          home.type === "oppo-error" ? (
            <>
              對方失誤
              <IconWin />
            </>
          ) : (
            <>
              <Number>{playerNumber}</Number>
              {oursType?.text}
              {home.type && (win ? <IconWin /> : <IconLose />)}
            </>
          )
        ) : (
          <Number>{playerNumber}</Number>
        )}
      </RecordText>
      <RecordText editing={editingItem === "oppo"}>
        {away.type &&
          (away.type === "oppo-error" ? (
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
    </div>
  );
};

export default Rally;
