"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SplitFlapText } from "@/components/animations/SplitFlapText";

export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    // Short-lived entry state
    const timer = setTimeout(() => {
      router.push("/journey");
    }, 3500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-[#0a0a0a]">
      <div className="flex flex-col items-center gap-8">
        <div className="scale-125 md:scale-150 transform origin-center">
          <SplitFlapText text="ITINERA" speed={150} />
        </div>
        <div className="text-neutral-500 font-mono text-sm tracking-widest animate-pulse mt-4">
          INITIALIZING...
        </div>
      </div>
    </main>
  );
}
