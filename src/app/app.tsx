"use client";

import dynamic from "next/dynamic";
import { PROJECT_TITLE } from "~/lib/constants";

const Frame = dynamic(() => import("~/components/Frame").then((mod) => mod.default), {
  ssr: false,
  loading: () => <div>Loading predictions...</div>
});

export default function App(
  { title }: { title?: string } = { title: PROJECT_TITLE }
) {
  return <Frame title={title} />;
}
