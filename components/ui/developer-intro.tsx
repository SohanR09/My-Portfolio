import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Skeleton } from "./skeleton";

interface DeveloperIntroProps {
  name?: string;
  designation?: string;
  className?: string;
  isLoading: boolean;
}

export function DeveloperIntro({
  name = "John Doe",
  designation = "Full Stack Developer",
  className,
  isLoading = true,
}: DeveloperIntroProps) {
  const words = designation.split(" ");
  return (
    <motion.section
      className={cn("flex flex-col items-center text-center", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
    >
      {isLoading ? (
        <Skeleton className="h-16 w-3/4 mx-auto dark:bg-slate-100 mb-4" />
      ) : (
        <motion.h1
          className="text-4xl sm:text-4xl font-bold md:text-6xl text-white mb-4"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {name}
        </motion.h1>
      )}

      {isLoading ? (
        <Skeleton className="h-10 w-2/4 mx-auto dark:bg-slate-100" />
      ) : (
        <motion.h2
          className="mt-2 text-2xl sm:text-xl md:text-3xl text-blue-300 mb-6"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          {designation}
        </motion.h2>
      )}
    </motion.section>
  );
}
