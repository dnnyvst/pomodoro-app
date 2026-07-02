"use client";

import { useContext } from "react";
import { TimerContext } from "@/components/timer-provider";
import usePrefersReducedMotion from "@/app/hooks/use-prefers-reduced-motion";
import ThemeToggle from "../components/theme-toggle";
import SnowToggle from "../components/snow-toggle";
import SettingsDialog from "@/components/settings-dialog";

const ControlHub = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { onBreak } = useContext(TimerContext);

  return (
    <span
      className={`right-0 absolute flex p-2 sm:p-6 z-50 ${
        onBreak &&
        !prefersReducedMotion &&
        "text-foreground dark:text-foreground"
      }`}
    >
      <ThemeToggle />
      <SnowToggle />
      <SettingsDialog />
    </span>
  );
};

export default ControlHub;
