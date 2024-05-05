"use client";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { FiPlus, FiMinus, FiCheck, FiRepeat } from "react-icons/fi";
import { matchActions } from "./match-slice";
import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  recordTypes,
  recordFrontTypes,
  recordBackTypes,
  recordErrorTypes,
} from "../lib/record-types";

const Container = styled.div`
  flex: 1;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 0.5rem;
  &.column {
    display: flex;
    flex-direction: column;
    button {
      padding: 0.375rem;
    }
  }
`;

const OptionBtn = styled.button`
  width: 100%;
  flex: 1 0 2rem;
  min-width: fit-content;
  padding: 0.5rem 0.75rem 0.5rem 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-200);
  border: none;
  border-radius: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-900);
  gap: 0.5rem;
  transition: all 0.2s ease-in-out;
  svg {
    color: var(--primary-900);
    width: 2rem;
    height: 2rem;
  }
  &:disabled {
    background-color: var(--primary-300);
    font-weight: 400;
    color: var(--primary-700);
    svg {
      color: var(--primary-700);
    }
  }
  &.win {
    background-color: var(--secondary-200);
    svg {
      color: var(--secondary-500);
    }
    &:active,
    &.toggled {
      background-color: var(--secondary-500);
      color: var(--primary-100);
      svg {
        color: var(--primary-100);
      }
    }
    &:disabled {
      background-color: var(--primary-300);
      font-weight: 400;
      color: var(--primary-700);
      svg {
        color: var(--primary-700);
      }
    }
  }
  &.lose {
    background-color: var(--danger-200);
    svg {
      color: var(--danger-500);
    }
    &:active,
    &.toggled {
      background-color: var(--danger-500);
      color: var(--primary-100);
      svg {
        color: var(--primary-100);
      }
    }
    &:disabled {
      background-color: var(--primary-300);
      font-weight: 400;
      color: var(--primary-700);
      svg {
        color: var(--primary-700);
      }
    }
  }
`;

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
          <Container className={zone === 0 && "column"}>
            {oursOptions.map((option) => (
              <OptionBtn
                key={option.num}
                className={`
                ${option.win === null ? "" : option.win ? "win" : "lose"} 
                ${ours.num === option.num && "toggled"}
              `}
                onClick={() => handleOursClick(option)}
                disabled={
                  (zone !== 1 || !isServing) && option.type === "serving"
                }
              >
                {zone === 0 ? `對方${option.description}` : option.text}
                {option.win === null ? (
                  <FiRepeat />
                ) : option.win ? (
                  <FiPlus />
                ) : (
                  <FiMinus />
                )}
              </OptionBtn>
            ))}
          </Container>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle>對方得失分紀錄</CardTitle>
          </CardHeader>
          <Container className="column">
            {oppoOptions.map((option) => (
              <OptionBtn
                key={option.num + 15}
                className={`
                    ${win ? "lose" : "win"} 
                    ${oppo.num === option.num && "toggled"}
                  `}
                onClick={() => handleOppoClick(option)}
                disabled={zone === 0 && isServing}
              >
                {option.type === "oppo-error"
                  ? `我方${option.description}`
                  : `對方${option.text}`}
                {option.win ? <FiPlus /> : <FiMinus />}
              </OptionBtn>
            ))}
          </Container>
          <OptionBtn className="win" onClick={handleConfirm}>
            <FiCheck />
            確定
          </OptionBtn>
        </>
      )}
    </>
  );
};

export default Options;
