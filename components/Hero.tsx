"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SITE_CONFIG } from "@/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ResumeSetting } from "@/lib/services/site-settings";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import SocialLink from "./SocialLink";
import { ProfileImage } from "./ui/profile-image";
import { DeveloperIntro } from "./ui/developer-intro";
import { AnimatedButton } from "./ui/animated-button";
import ViewResumeButton from "./ViewResumeButton";

interface HeroImage {
  path: string;
  filename: string;
  url: string;
  lastUpdated?: string;
}

interface TextContent {
  headerName: string;
  heroName: string;
  heroSubtitle: string;
  lastUpdated?: string;
}

/**
 * Hero section component that displays the main introduction
 * with animated background and profile information.
 */
export default function Hero() {
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null);
  const [textContent, setTextContent] = useState<TextContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [resume, setResume] = useState<ResumeSetting | null>(null);

  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch resume url
        const resumeResponse = await fetch("/api/site-settings/resume");
        if (resumeResponse.ok) {
          const resumeData = await resumeResponse.json();
          setResume(resumeData);
        }
        // Fetch hero image
        const imageResponse = await fetch("/api/site-settings/hero-image");
        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          setHeroImage(imageData);
        }

        // Fetch text content
        const textResponse = await fetch("/api/site-settings/text-content");
        if (textResponse.ok) {
          const textData = await textResponse.json();
          setTextContent(textData);
        }
      } catch (err) {
        console.error("Error fetching hero data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load hero data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       // Fetch latest posts
  //       const supabase = getSupabaseClient();
  //       const { data: postsData, error: postsError } = await supabase
  //         .from("blog_posts")
  //         .select("id, title, date")
  //         .order("created_at", { ascending: false })
  //         .limit(3);

  //       if (postsError) {
  //         console.error("Error fetching latest posts:", postsError);
  //         setError("Unable to load blog posts at this time");
  //         setLatestPosts([]);
  //       } else {
  //         setLatestPosts(postsData || []);
  //         setError(null);
  //       }
  //     } catch (err) {
  //       console.error("Failed to fetch data:", err);
  //       setError("Unable to load data at this time");
  //       setLatestPosts([]);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  //   fetchData();
  // }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-0">
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            },
          }}
        >
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-500 opacity-10"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 40 + 10}px`,
                height: `${Math.random() * 40 + 10}px`,
                animation: `float ${Math.random() * 10 + 5}s infinite`,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col-reverse md:flex-row items-center justify-center">
          <div className="md:w-1/2 text-center">
            {/* name & designation name animation */}
            <DeveloperIntro
              name={textContent?.heroName || SITE_CONFIG.name}
              designation={textContent?.heroSubtitle || SITE_CONFIG.title}
              className="mb-4"
              isLoading={isLoading}
            />

            {/* view resume button with animation */}
            <ViewResumeButton
              url={resume?.url as string}
              isLoading={isLoading}
            />
            {/* Social links section */}
            <SocialLink />
          </div>
          <div className="md:w-1/2 mb-8 md:mt-0 flex justify-center">
            {/* <div className="relative w-64 h-64 md:w-80 md:h-80"> */}
            {/* Profile image or user icon */}
            {isLoading ? (
              <Skeleton className="w-64 h-64 rounded-full dark:bg-slate-100" />
            ) : heroImage ? (
              <ProfileImage
                src={heroImage.url || "/placeholder.svg"}
                alt={textContent?.heroName || SITE_CONFIG.name}
                size={isMobile ? 300 : 400}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-blue-400 to-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-32 h-32 text-white"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
            {/* </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
