import { Suspense } from "react";
import Funnel from "@/components/Funnel";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Funnel />
    </Suspense>
  );
}
