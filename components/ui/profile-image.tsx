import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProfileImageProps {
  src: string;
  alt?: string;
  size?: number; // in pixels
  className?: string;
}

export function ProfileImage({
  src,
  alt = "Profile",
  size = 100,
  className = "",
}: ProfileImageProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className={cn(
        "rounded-full border-4 border-blue-300 shadow-lg overflow-hidden bg-gray-200 flex items-center justify-center hover:rotate-1",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="object-cover w-full h-full"
      />
    </motion.div>
  );
}
