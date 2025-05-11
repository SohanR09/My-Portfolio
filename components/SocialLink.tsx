"use client";

import { SITE_CONFIG } from "@/constants";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaGraduationCap } from "react-icons/fa";
import { GithubIcon } from "./animateIcon/Github";
import { LinkedinIcon } from "./animateIcon/LinkedIn";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

interface SocialLinkProps {
  align?: "justify-start" | "justify-center" | "justify-end";
}

export default function SocialLink({
  align = "justify-center",
}: SocialLinkProps) {
  const [socialLinks, setSocialLinks] = useState<any | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch social links
        const socialResponse = await fetch("/api/site-settings/social-links");
        if (socialResponse.ok) {
          const socialData = await socialResponse.json();
          setSocialLinks(socialData);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Unable to load data at this time");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-x-4 mt-6">
        <div className="flex justify-center space-x-4 mt-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-8 w-8 rounded-full dark:bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={cn("flex space-x-4 mt-6", align)}>
      <Link
        href={socialLinks?.linkedin || SITE_CONFIG.socialLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* <FaLinkedin className="text-2xl hover:text-blue-300 transition-colors text-white" /> */}
        <LinkedinIcon className="text-2xl hover:text-blue-300 transition-colors text-white" />
      </Link>
      <Link
        href={socialLinks?.github || SITE_CONFIG.socialLinks.github}
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* <FaGithub className="text-2xl hover:text-blue-300 transition-colors text-white" /> */}
        <GithubIcon className="text-2xl hover:text-blue-300 transition-colors text-white" />
      </Link>
      <Link
        href={socialLinks?.scholar || SITE_CONFIG.socialLinks.scholar}
        target="_blank"
        rel="noopener noreferrer"
        className="flex justify-center items-center"
      >
        <FaGraduationCap className="text-2xl hover:text-blue-300 transition-colors text-white" />
      </Link>
    </div>
  );
}
