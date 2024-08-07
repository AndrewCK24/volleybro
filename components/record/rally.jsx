import { cn } from "@/lib/utils";
import { FiPlus, FiMinus, FiUser } from "react-icons/fi";
import { scoringActions } from "@/lib/scoring-actions";

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

const RecordText = ({ children, className }) => (
  <p
    className={cn(
      "flex flex-row flex-1 text-[1.375rem] gap-1 px-1 h-6 max-w-[calc(100%-9rem)] border-l-[0.125rem]",
      className
    )}
  >
    {children}
  </p>
);

const Number = ({ children }) => (
  <span className="text-[1.375rem] font-semibold">{children}</span>
);

const IconWin = () => <FiPlus className="w-6 h-6 text-primary stroke-[3px]" />;

const IconLose = () => (
  <FiMinus className="w-6 h-6 text-destructive stroke-[3px]" />
);

const Rally = ({ rally, players, onClick, className }) => {
  const { win, home, away } = rally;
  const oursType = scoringActions[home.num];
  const oppoType = scoringActions[away.num];
  const playerNumber = players.find((p) => p._id === home.player._id)?.number;

  return (
    <div
      className={cn(
        "flex flex-row items-center justify-start flex-none w-full gap-1 basis-8",
        className
      )}
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
      <RecordText className="border-primary">
        {home.type ? (
          home.type !== "oppo-error" && (
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
      <RecordText className="border-destructive">
        {away.type && away.type !== "oppo-error" && (
          <>
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-destructive text-primary-foreground">
              <FiUser />
            </span>
            {oppoType?.text}
            {win ? <IconLose /> : <IconWin />}
          </>
        )}
      </RecordText>
    </div>
  );
};

export default Rally;
