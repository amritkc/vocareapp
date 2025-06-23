"use client"; 

import dynamic from "next/dynamic";

const CalenderContain = dynamic(
  () => import("@/components/calander/CalenderContain"),
  { ssr: false } 
);

export default function Home() {
  return (
    <div className="container mx-auto py-6">
      <CalenderContain />
    </div>
  );
}
