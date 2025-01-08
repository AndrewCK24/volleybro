"use client";
import { cn } from "@/lib/utils";

export const SquaresStack = () => {
  const squares = 10;
  const highlight = 4;
  // const [highlight, setHighlight] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setHighlight((prev) => (prev + 1) % 10);
  //   }, 100);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div
      className="absolute top-0 right-0 overflow-hidden pointer-events-none"
      style={{
        width: "calc(min(100vw, 100vh))",
        height: "calc(min(100vw, 100vh))",
      }}
    >
      {[...Array(squares)].map((_, index) => (
        <div
          key={index}
          className={cn(
            "absolute bg-background top-0 right-0 aspect-square transition duration-300 rounded-[1.5rem]",
            index === squares - highlight ? "bg-destructive" : "bg-background"
          )}
          style={{
            width: `calc(min(100vw, 100vh) * (0.65 - ${index * 0.05}))`,
            height: `calc(min(100vw, 100vh) * (0.65 - ${index * 0.05}))`,
            opacity: 0.1 + index * 0.1,
            rotate: `${(squares - index - 1) * 5}deg`,
          }}
        />
      ))}
    </div>
  );
};
