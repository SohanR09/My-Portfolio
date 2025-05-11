"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MoonIcon } from "./animateIcon/Moon";
import { SunIcon } from "./animateIcon/Sun";

export function DarkModeToggle({ isScrolling }: { isScrolling: boolean }) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="static top-4 right-4 z-50">
        <div className="h-[1.5rem] w-[1.3rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="static top-4 right-4 z-50 hover:bg-transparent"
    >
      <div className="flex justify-center items-center w-full h-full">
        {" "}
        {resolvedTheme === "dark" ? (
          <SunIcon className="h-[1.5rem] w-[1.3rem]" />
        ) : (
          <MoonIcon
            className={`h-[1.5rem] w-[1.3rem]  ${
              isScrolling ? "text-gray-900 dark:text-white" : "text-white"
            }`}
          />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
