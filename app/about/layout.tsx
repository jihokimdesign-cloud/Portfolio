import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Jiho Kim — Product Designer",
  description:
    "From coastal Vizag to NASA labs in Maryland — the full story of Jiho Kim, Product Designer and UX Researcher.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
