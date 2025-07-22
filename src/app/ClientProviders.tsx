"use client";
import { ToastProvider } from "../components/ToastNotificationProvider";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
