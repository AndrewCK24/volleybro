"use client";
import { useDispatch, useSelector } from "react-redux";
import { matchActions } from "../store/match-slice";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { FiPlus, FiMinus, FiCheck, FiRepeat } from "react-icons/fi";
import {
  recordTypes,
  recordFrontTypes,
  recordBackTypes,
  recordErrorTypes,
} from "../lib/record-types";

const Container = ({ children, className }) => {
  return (
    <div className={cn("grid flex-1 w-full grid-cols-2 gap-2", className)}>
      {children}
    </div>
  );
};

const Options = () => {
  const dispatch = useDispatch();
  const { isServing } = useSelector((state) => state.match.status);
  const { zone, ours, oppo, win } = useSelector(
    (state) => state.match.recording
  );
  const oursOptions =
    zone === 0
      ? recordErrorTypes
      : zone === 1 || zone >= 5
      ? recordBackTypes
      : recordFrontTypes;

  const oppoOptions = recordTypes.filter((option) =>
    recordTypes[ours.num]?.outcome.includes(option.num)
  );

  const handleOursClick = (option) => {
    dispatch(matchActions.setRecordingOursType({ type: option }));
  };

  const handleOppoClick = (option) => {
    dispatch(matchActions.setRecordingOppoType({ type: option }));
  };

  const handleConfirm = () => {
    dispatch(matchActions.confirmRecording());
  };

  return (
    <>
      {oppo.num === null ? (
        <>
          <CardHeader>
            <CardTitle>我方得失分紀錄</CardTitle>
          </CardHeader>
          <Container className={zone === 0 && "grid-cols-1"}>
            {oursOptions.map((option) => (
              <Button
                key={`${option.type}-${option.num}`}
                variant={`${
                  option.win === null
                    ? "secondary"
                    : option.win
                    ? ours.num === option.num
                      ? "default"
                      : "option_win"
                    : ours.num === option.num
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
          <CardHeader>
            <CardTitle>對方得失分紀錄</CardTitle>
          </CardHeader>
          <Container className="grid-cols-1">
            {oppoOptions.map((option) => (
              <Button
                key={`${option.type}-${option.num + 15}`}
                variant={`${
                  option.win === null
                    ? "secondary"
                    : option.win
                    ? oppo.num === option.num
                      ? "default"
                      : "option_win"
                    : oppo.num === option.num
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
    </>
  );
};

export default Options;
