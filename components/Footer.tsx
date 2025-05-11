"use client";

import { FOOTER_LINKS, SITE_CONFIG } from "@/constants";
import { getSupabaseClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import SocialLink from "./SocialLink";

type BlogPost = {
  id: string;
  title: string;
  date: string;
};

interface SocialLinks {
  linkedin: string;
  github: string;
  scholar: string;
  email: string;
}

/**
 * Footer component that displays copyright information and links
 * to social media profiles and legal pages.
 */
export default function Footer() {
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch latest posts
        const supabase = getSupabaseClient();
        const { data: postsData, error: postsError } = await supabase
          .from("blog_posts")
          .select("id, title, date")
          .order("created_at", { ascending: false })
          .limit(3);

        if (postsError) {
          console.error("Error fetching latest posts:", postsError);
          setError("Unable to load blog posts at this time");
          setLatestPosts([]);
        } else {
          setLatestPosts(postsData as any[]);
          setError(null);
        }

        // Fetch social links
        const socialResponse = await fetch("/api/site-settings/social-links");
        if (socialResponse.ok) {
          const socialData = await socialResponse.json();
          setSocialLinks(socialData);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Unable to load data at this time");
        setLatestPosts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">About Me</h3>
            <p className="text-gray-400">
              Full Stack Developer with expertise in React, Node.js, and cloud
              technologies.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Latest Blog Posts</h3>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="h-5 bg-gray-800 rounded w-3/4 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : latestPosts.length > 0 ? (
              <ul className="space-y-2">
                {latestPosts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/blog?post=${post.id}`}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">
                {error ||
                  "Blog posts will be available soon. Please check back later."}
              </p>
            )}
            <div className="mt-4">
              <Link
                href="/blog"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                View all posts →
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Connect</h3>
            <SocialLink align={"justify-start"} />
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-center items-center">
          <div className="mb-4 md:mb-0">
            <p>
              &copy; {new Date().getFullYear()} {SITE_CONFIG.copyright}
            </p>
          </div>
          <div className="flex space-x-4 hidden">
            {FOOTER_LINKS.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
