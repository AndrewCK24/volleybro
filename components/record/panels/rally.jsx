"use client";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { FiPlus, FiMinus, FiCheck, FiRepeat } from "react-icons/fi";
import {
  rallyOutcomes,
  rallyFrontOutcomes,
  rallyBackOutcomes,
  rallyErrorOutcomes,
} from "@/lib/rally-outcomes";

const Container = ({ children, className }) => {
  return (
    <div className={cn("grid flex-1 w-full grid-cols-2 gap-2", className)}>
      {children}
    </div>
  );
};

const RecordRally = ({ recordState, recordActions }) => {
  const dispatch = useDispatch();
  const {
    status: { isServing },
    recording: { zone, home, away },
  } = recordState;
  const oursOptions =
    zone === 0
      ? rallyErrorOutcomes
      : zone === 1 || zone >= 5
      ? rallyBackOutcomes
      : rallyFrontOutcomes;

  const oppoOptions = rallyOutcomes.filter((option) =>
    rallyOutcomes[home.num]?.outcome.includes(option.num)
  );

  const handleOursClick = (option) => {
    dispatch(recordActions.setRecordingOursType({ type: option }));
  };

  const handleOppoClick = (option) => {
    dispatch(recordActions.setRecordingOppoType({ type: option }));
  };

  const handleConfirm = () => {
    dispatch(recordActions.confirmRecording());
  };

  return (
    <Card className="flex-1 w-full pb-4">
      <CardHeader>
        <CardTitle>{away.num === null ? "我方" : "對方"}得失分紀錄</CardTitle>
      </CardHeader>
      {away.num === null ? (
        <>
          <Container className={zone === 0 && "grid-cols-1"}>
            {oursOptions.map((option) => (
              <Button
                key={`${option.type}-${option.num}`}
                variant={`${
                  option.win === null
                    ? "secondary"
                    : option.win
                    ? home.num === option.num
                      ? "default"
                      : "option_win"
                    : home.num === option.num
                    ? "destructive"
                    : "option_lose"
                }`}
                size="lg"
                className="h-full text-[1.5rem] pr-1 transition-colors duration-200"
                onClick={() => handleOursClick(option)}
                disabled={
                  (zone !== 1 || !isServing) && option.type === "serving"
                }
              >
                {zone === 0 ? `對方${option.description}` : option.text}
                {option.win === null ? (
                  <FiRepeat />
                ) : option.win ? (
                  <FiPlus className="text-primary" />
                ) : (
                  <FiMinus className="text-destructive" />
                )}
              </Button>
            ))}
          </Container>
        </>
      ) : (
        <>
          <Container className="grid-cols-1">
            {oppoOptions.map((option) => (
              <Button
                key={`${option.type}-${option.num + 15}`}
                variant={`${
                  option.win === null
                    ? "secondary"
                    : option.win
                    ? away.num === option.num
                      ? "default"
                      : "option_win"
                    : away.num === option.num
                    ? "destructive"
                    : "option_lose"
                }`}
                size="lg"
                className="h-full text-[1.5rem] pr-1 transition-colors duration-200"
                onClick={() => handleOppoClick(option)}
                disabled={zone === 0 && isServing}
              >
                {option.type === "oppo-error"
                  ? `我方${option.description}`
                  : `對方${option.text}`}
                {option.win ? <FiPlus /> : <FiMinus />}
              </Button>
            ))}
          </Container>
          <Button
            size="lg"
            className="text-[1.5rem] pr-1 transition-colors duration-200"
            onClick={handleConfirm}
          >
            <FiCheck />
            確定
          </Button>
        </>
      )}
    </Card>
  );
};

export default RecordRally;
