import { useIsMobile } from "@/hooks/use-mobile";
import React from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { Button } from "./ui/button";
import { FaFilePdf } from "react-icons/fa";
import { AnimatedButton } from "./ui/animated-button";

interface ViewResumeButtonProps {
  isLoading: boolean;
  url: string;
}

export default function ViewResumeButton({
  isLoading,
  url,
}: ViewResumeButtonProps) {
  const isMobile = useIsMobile();
  return (
    <AnimatedButton>
      {isLoading ? (
        <Skeleton className="h-10 w-40 mx-auto rounded-full dark:bg-slate-100" />
      ) : (
        <Link href={isMobile && url ? url : "/view-resume"}>
          <Button
            id="scale-up-center-alternate"
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full transition duration-300 transform hover:scale-105"
          >
            <FaFilePdf className="text-lg mr-2" />
            View Resume
          </Button>
        </Link>
      )}
    </AnimatedButton>
  );
}
