import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";

const LoadingCard = ({ className }: { className?: string }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="w-40 h-8 rounded-md bg-muted motion-safe:animate-pulse" />
      </CardHeader>
      <div className="w-20 h-6 rounded-md bg-muted animate-pulse" />
      <div className="h-6 rounded-md w-60 bg-muted animate-pulse" />
      <div className="w-40 h-6 rounded-md bg-muted animate-pulse" />
      <div className="w-24 h-6 rounded-md bg-muted animate-pulse" />
    </Card>
  );
};

export default LoadingCard;
