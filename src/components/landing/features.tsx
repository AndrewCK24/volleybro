"use client";
import Image from "next/image";
import { useRef } from "react";
import { motion, useTransform, useScroll } from "motion/react";
import { cn } from "@/lib/utils";

const cards = [
  { id: "創建隊伍", src: "/landing/features/01.png" },
  { id: "設定陣容", src: "/landing/features/02.png" },
  { id: "記錄比賽", src: "/landing/features/03.png" },
  { id: "逐球紀錄", src: "/landing/features/04.png" },
];

export const Features = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-75%"]);

  return (
    <section
      ref={targetRef}
      className="relative h-[300vh] bg-linear-to-b from-black/0 from-20% to-muted to-80%"
    >
      <div className="sticky top-0 flex items-center h-screen overflow-hidden">
        <motion.div style={{ x }} className="flex gap-4">
          {cards.map((card) => {
            return <Card card={card} key={card.id} />;
          })}
        </motion.div>
      </div>
    </section>
  );
};

const Card = ({ card }) => {
  return (
    <div
      key={card.id}
      className={cn(
        "group relative h-[80vh] aspect-[1/2.17] overflow-hidden",
        "flex flex-col justify-end items-center rounded-3xl shadow-sm",
        "bg-linear-to-t from-background from-30% to-destructive to-80%",
        "md:w-[50vw] md:aspect-auto"
      )}
    >
      <div className="flex flex-col items-center justify-center flex-1 w-full">
        <p className="font-mono text-2xl font-medium tracking-widest text-destructive-foreground">
          {card.id}
        </p>
      </div>
      <div className="size-[80%] transition-transform duration-300 group-hover:scale-110 relative overflow-hidden rounded-3xl border-2 border-foreground md:w-auto md:aspect-[1/2.17]">
        <Image
          src={card.src}
          fill={true}
          alt={card.id}
          className="z-0 object-cover"
        />
      </div>
    </div>
  );
};
