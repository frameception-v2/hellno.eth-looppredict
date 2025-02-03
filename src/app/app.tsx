"use client";

import dynamic from "next/dynamic";
import { PROJECT_TITLE } from "~/lib/constants";

const Frame = dynamic(() => import("~/components/Frame"), {
  ssr: false,
  loading: () => <div>Loading predictions...</div>
});

export default function App() {
  return <Frame />;
}
