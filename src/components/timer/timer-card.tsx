"use client";

import { useState, useEffect, useContext, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Input from "./input";
import SessionTypeButtonGroup from "./session-type-button-group";
import BreakReminderDialog from "@/components/break-reminder-dialog";
import { TimerContext } from "@/components/timer-provider";

const getFormattedNumberString = (string: string) =>
  string.length === 1 ? `0${string}` : string;

const TimerCard = () => {
  const {
    running,
    setRunning,
    activeSessionTypeId,
    setActiveSessionTypeId,
    onBreak,
    completedPomodoros,
    setCompletedPomodoros,
  } = useContext(TimerContext);
  const [minutes, setMinutes] = useState<string>("25");
  const [seconds, setSeconds] = useState<string>("00");
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const timerBackgroundRef = useRef<HTMLDivElement>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const showBreakReminder = activeSessionTypeId !== 3 && completedPomodoros > 3;

  if (audio) {
    audio.volume = 0.5;
  }

  useEffect(() => {
    setAudio(new Audio("/bell_ding.mp3"));
  }, []);

  // Handle display updates during minute rollover
  useEffect(() => {
    if (running) {
      if (seconds === "-1") {
        setSeconds("59");
        setMinutes((minutes) =>
          getFormattedNumberString(`${parseInt(minutes) - 1}`),
        );
      }
      document.title = `${minutes}:${seconds}`;
    }
  }, [seconds, minutes, running]);

  useEffect(() => {
    setMinutes(
      activeSessionTypeId === 1
        ? "25"
        : activeSessionTypeId === 2
          ? "05"
          : activeSessionTypeId === 3
            ? "15"
            : "00",
    );
    setSeconds("00");
  }, [activeSessionTypeId]);

  const handleClickPlayPauseButton = () => {
    if (running) {
      pauseTimer();
    } else if (!showBreakReminder) {
      startTimer();
    }
  };

  const updateCompletedPomodorosAndTimer = () => {
    // Completing a pomodoro
    let newPomodoroCount = completedPomodoros + 1;
    if (activeSessionTypeId === 1) {
      if (completedPomodoros >= 4) {
        newPomodoroCount = 1;
      }
      setCompletedPomodoros(newPomodoroCount);
      if (newPomodoroCount > 3) {
        setActiveSessionTypeId(3);
      } else {
        setActiveSessionTypeId(2);
      }
    } else {
      // Completing a break
      setActiveSessionTypeId(1);
      if (activeSessionTypeId === 3 && completedPomodoros > 3) {
        setCompletedPomodoros(0);
      }
    }
  };

  const startTimer = () => {
    setRunning(true);

    const endTime = new Date();
    endTime.setMinutes(endTime.getMinutes() + +minutes);
    endTime.setSeconds(endTime.getSeconds() + +seconds);

    const timer = setInterval(() => {
      const now = new Date();
      if (endTime.getTime() - now.getTime() < 0) {
        audio?.play();
        clearInterval(timer);
        setRunning(false);
        updateCompletedPomodorosAndTimer();
      } else {
        setSeconds((seconds) =>
          getFormattedNumberString(`${parseInt(seconds) - 1}`),
        );
      }
    }, 1000);

    setIntervalId(+timer);
  };

  const pauseTimer = () => {
    clearInterval(intervalId as number);
    setIntervalId(null);
    setRunning(false);
  };

  const playPauseButtonWidth =
    timerBackgroundRef?.current?.offsetWidth || 178.85;

  return (
    <Card
      className={`w-full sm:w-auto shadow-lg z-0 transition-colors duration-300 ${
        running && "border-transparent shadow-none select-none"
      } ${onBreak && "bg-transparent"}`}
    >
      <CardHeader className="flex gap-x-1 flex-row align-center space-y-0">
        <SessionTypeButtonGroup />
      </CardHeader>
      <CardContent className="flex justify-center items-center relative">
        <div
          ref={timerBackgroundRef}
          className={`flex text-6xl visible bg-card rounded-lg ${
            running && "pointer-events-none"
          }`}
        >
          <Input
            id="minutes-input"
            aria-label="minutes input"
            value={+minutes < 0 ? "00" : minutes}
            onChange={(e) => setMinutes(e.target.value)}
            onBlur={() =>
              setMinutes((minutes) =>
                getFormattedNumberString(
                  +minutes > 60 ? "60" : minutes || "00",
                ),
              )
            }
            disabled={running}
            cn="text-right sm:text-center"
          />
          {":"}
          <Input
            id="seconds-input"
            aria-label="seconds input"
            value={+seconds < 0 ? "00" : seconds}
            onChange={(e) => setSeconds(e.target.value)}
            onBlur={() =>
              setSeconds((seconds) =>
                getFormattedNumberString(
                  (+seconds > 59 ? "59" : seconds) || "00",
                ),
              )
            }
            disabled={running}
            cn="text-left sm:text-center"
          />
        </div>
        {/* <Button
          variant="ghost"
          className="absolute left-1/2 translate-x-full ml-14 px-1 opacity-40"
        >
          <History className="!w-[2rem] !h-[2rem]" />
        </Button> */}
      </CardContent>
      <CardFooter className="justify-center">
        <BreakReminderDialog
          triggerEnabled={showBreakReminder}
          onClickConfirm={() => {
            setActiveSessionTypeId(3);
          }}
          onClickDeny={() => {
            setCompletedPomodoros(0);
            startTimer();
          }}
        >
          <Button
            id="start-pause-button"
            aria-label="start or pause button"
            variant={running ? "destructive" : "default"}
            onClick={handleClickPlayPauseButton}
            aria-disabled={
              !minutes || !seconds || (minutes === "00" && seconds === "00")
            }
            className="visible"
            style={{ width: playPauseButtonWidth }}
          >
            {running ? "pause" : "start"}
          </Button>
        </BreakReminderDialog>
      </CardFooter>
    </Card>
  );
};

export default TimerCard;
