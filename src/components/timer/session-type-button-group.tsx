"use client";

import { useContext } from "react";
import { TimerContext } from "@/components/timer-provider";
import { Button } from "@/components/ui/button";

type Session = {
  id: number;
  text: string;
  defaultMinutes: string;
};

const sessions: Session[] = [
  { id: 1, text: "pomodoro", defaultMinutes: "25" },
  { id: 2, text: "short break", defaultMinutes: "05" },
  { id: 3, text: "long break", defaultMinutes: "15" },
];

const SessionTypeButtonGroup = () => {
  const {
    running,
    activeSessionTypeId,
    setActiveSessionTypeId,
    completedPomodoros,
  } = useContext(TimerContext);

  return (
    <div className="flex flex-col items-center gap-y-2 sm:flex-row flex-1 gap-x-1 justify-center">
      {sessions.map(({ id, text }: Session) => (
        <Button
          key={id}
          id={`${text}-button`}
          aria-label={text}
          variant="outline"
          onClick={() => setActiveSessionTypeId(id)}
          className={`w-3/4 transition-colors duration-300 ${
            activeSessionTypeId !== id && "border-transparent"
          } ${
            activeSessionTypeId === id && "!opacity-100 hover:bg-background"
          } ${running && "text-transparent border-transparent bg-transparent"}`}
          aria-disabled={
            running ||
            activeSessionTypeId === id ||
            (id === 2 && completedPomodoros > 3)
          }
          disabled={running}
        >
          {text}
        </Button>
      ))}
    </div>
  );
};

export default SessionTypeButtonGroup;
