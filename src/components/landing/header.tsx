"use client";
import Image from "next/image";
import { useEffect, useState, RefObject } from "react";
import { CTAButton } from "@/components/landing/cta-button";

interface HeaderProps {
  observerRef: RefObject<HTMLDivElement>;
}

export const Header = ({ observerRef }: HeaderProps) => {
  const [isShowingCTA, setIsShowingCTA] = useState(false);

  useEffect(() => {
    const targetElement = observerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => setIsShowingCTA(!entry.isIntersecting),
      { threshold: 1 }
    );

    if (targetElement) {
      observer.observe(targetElement);
    }

    return () => {
      if (targetElement) {
        observer.unobserve(targetElement);
      }
    };
  }, [observerRef]);

  return (
    <header
      className={`sticky top-0 left-0 z-50 flex flex-row items-center justify-start w-full px-4 py-2 transition-colors ${
        isShowingCTA ? "bg-primary" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-start flex-1 h-9">
        <Image
          src="/logo.svg"
          alt="VolleyBro"
          width={140}
          height={30}
          priority={true}
        />
      </div>
      <CTAButton
        className={`transition-opacity ease-in-out ${
          isShowingCTA ? "opacity-100" : "opacity-0"
        }`}
      />
    </header>
  );
};
