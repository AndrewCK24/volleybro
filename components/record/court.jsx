import {
  Court,
  Outside,
  Inside,
  PlayerCard,
  AdjustButton,
} from "@/components/custom/court";

const RecordCourt = () => {
  return (
    <Court>
      <Outside className="inner"></Outside>
      <Inside></Inside>
    </Court>
  );
};

export default RecordCourt;
