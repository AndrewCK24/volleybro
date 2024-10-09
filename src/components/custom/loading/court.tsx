import {
  Court,
  Outside,
  Inside,
  LoadingCard,
  AdjustButton,
} from "@/components/custom/court";

const LoadingCourt = ({ className }: { className?: string }) => {
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
