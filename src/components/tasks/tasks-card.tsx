"use client";

import { useState, useEffect, useContext } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TaskList from "@/components/tasks/task-list";
import { CloudDownload, Plus } from "lucide-react";
import { Task } from "./types";
import { TimerContext } from "@/components/timer-provider";
import usePrefersReducedMotion from "@/app/hooks/use-prefers-reduced-motion";
import useLocalStorage from "@/app/hooks/use-local-storage";

const TasksCard = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { running, onBreak } = useContext(TimerContext);
  const {
    value: tasks,
    setValue: setTasks,
    loading,
  } = useLocalStorage("tasks", [] as Task[]);
  const [newTaskText, setNewTaskText] = useState<string>("");

  // abandon in-progress edits if the timer starts
  useEffect(() => {
    if (running) {
      setNewTaskText("");
      document.body.style.overflow = "hidden";
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    } else {
      document.body.style.overflow = "visible";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const addTask = (text: string) => {
    setTasks((tasks) => [
      ...tasks,
      { id: Date.now(), text, status: "incomplete" },
    ]);
  };

  const setStatus = (id: number, status: string) => {
    setTasks((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, status } : task)),
    );
  };

  const setText = (id: number, text: string) => {
    setTasks((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, text } : task)),
    );
  };

  const deleteTask = (id: number) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
  };

  return (
    <Card
      id="task-list"
      className={`w-full shadow-lg z-0 transition-colors duration-300 ${
        running && "border-transparent shadow-none text-transparent select-none"
      } ${onBreak && "bg-transparent"}`}
    >
      <CardHeader>
        <CardTitle>tasks</CardTitle>
        <CardDescription
          className={`sm:hidden transition-colors duration-300 ${
            running && "text-transparent"
          }`}
        >
          <p>touch and hold to drag/reorder</p>
          <p>swipe left to edit/delete</p>
        </CardDescription>
        <CardDescription
          className={`hidden sm:block transition-colors duration-300 ${
            running && "text-transparent"
          }`}
        >
          click and drag to reoder
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        {loading ? (
          <div className="flex justify-center gap-x-2">
            <span className="motion-safe:animate-bounce">
              <CloudDownload />
            </span>
            Loading your tasks...
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            setTasks={setTasks}
            setStatus={setStatus}
            setText={setText}
            deleteTask={deleteTask}
          />
        )}
        <span className="flex gap-x-2">
          <Input
            id="add-new-task-input"
            aria-label="add new task input"
            value={newTaskText}
            className={`placeholder:italic border-dashed py-2 text-center transition-opacity duration-300 ${
              running && "!opacity-0"
            }`}
            placeholder="type here to add task"
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !!newTaskText.trim()) {
                addTask(newTaskText.trim());
                setNewTaskText("");
                document?.getElementById("add-new-task-input")?.blur();
                const y =
                  document
                    ?.getElementById("add-new-task-input")
                    ?.getBoundingClientRect()?.top || 0 + window?.scrollY;
                window?.scrollTo({
                  top: y,
                  behavior: prefersReducedMotion ? "auto" : "smooth",
                });
              }
            }}
            disabled={running}
            autoComplete="off"
          />
          <Button
            id="add-new-task-button"
            aria-label="add new task button"
            variant="outline"
            className={`aria-disabled:border-dashed w-fit px-6 transition-opacity duration-300 ${
              running && "!opacity-0"
            }`}
            onClick={() => {
              addTask(newTaskText.trim());
              setNewTaskText("");
            }}
            aria-disabled={!newTaskText.trim()}
            disabled={running}
          >
            <Plus />
            <span className="sr-only">Add new task</span>
          </Button>
        </span>
      </CardContent>
    </Card>
  );
};

export default TasksCard;
