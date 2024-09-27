import {
  Court,
  Outside,
  Inside,
  LoadingCard,
  AdjustButton,
} from "@/src/components/custom/court";

const LoadingCourt = ({ className }) => {
  return (
    <Court className={className}>
      <Outside>
        <AdjustButton />
        <LoadingCard />
        <LoadingCard />
      </Outside>
      <Inside>
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </Inside>
    </Court>
  );
};

export default LoadingCourt;
