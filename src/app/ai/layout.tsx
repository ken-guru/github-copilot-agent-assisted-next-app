import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Planner',
};

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
