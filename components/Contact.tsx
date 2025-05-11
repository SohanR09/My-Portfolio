"use client";

import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionTitle } from "@/components/ui/section-title";
import { Toast } from "@/components/ui/toast";
import { CONTACT_TEXT, SECTION_TITLES } from "@/constants";
import { motion } from "framer-motion";
import { Check, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { CopyIcon } from "./animateIcon/Copy";
import { AtSignIcon } from "./animateIcon/Email";
import { GithubIcon } from "./animateIcon/Github";
import { LinkedinIcon } from "./animateIcon/LinkedIn";

interface SocialLinks {
  linkedin: string;
  github: string;
  scholar: string;
  email: string;
}

/**
 * Contact section component that provides ways to get in touch
 * with the developer.
 */
export default function Contact() {
  const [toastVisible, setToastVisible] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await fetch("/api/site-settings/social-links");
        if (response.ok) {
          const data = await response.json();
          setSocialLinks(data);
        } else {
          console.error("Failed to fetch social links");
        }
      } catch (error) {
        console.error("Error fetching social links:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  const copyEmail = () => {
    if (socialLinks?.email) {
      navigator.clipboard.writeText(socialLinks.email);
      setToastVisible(true);
    }
  };

  return (
    <SectionContainer id="contact" background="light">
      <div className="max-w-3xl mx-auto text-center">
        <SectionTitle title={SECTION_TITLES.contact} />
        <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
          {CONTACT_TEXT}
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Email contact */}
            <motion.div
              className="flex flex-col items-center p-6 rounded-lg bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 shadow-md"
              whileHover={{ y: -5 }}
            >
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900 mb-3">
                <AtSignIcon
                  size={42}
                  className="w-10 h-10 text-red-500 dark:text-red-400"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Email
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                <a
                  href={`mailto:${socialLinks?.email || "contact@example.com"}`}
                  className="hover:underline text-blue-600 dark:text-blue-400"
                >
                  {socialLinks?.email || "contact@example.com"}
                </a>
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyEmail}
                className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-1"
              >
                <CopyIcon className="w-3.5 h-3.5 mr-1" size={16} /> Copy Email
              </Button>
            </motion.div>

            {/* LinkedIn contact */}
            <motion.div
              className="flex flex-col items-center p-6 rounded-lg bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 shadow-md"
              whileHover={{ y: -5 }}
            >
              <div className="p-3 rounded-full bg-white mb-3">
                <LinkedinIcon
                  size={42}
                  className="w-10 h-10 text-[#0A66C2] dark:text-[#0A66C2]"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                LinkedIn
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                Professional Profile
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#0A66C2] dark:text-[#0A66C2] hover:bg-blue-50 dark:hover:bg-blue-900/30"
                asChild
              >
                <a
                  href={socialLinks?.linkedin || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Connect <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </Button>
            </motion.div>

            {/* GitHub contact */}
            <motion.div
              className="flex flex-col items-center p-6 rounded-lg bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 shadow-md"
              whileHover={{ y: -5 }}
            >
              <div className="p-3 rounded-full bg-purple-200 dark:bg-gray-900 mb-3">
                <GithubIcon
                  size={42}
                  className="w-10 h-10 text-stone-900 dark:text-gray-200"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                GitHub
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                Code Repository
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                asChild
              >
                <a
                  href={socialLinks?.github || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Follow <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      <Toast
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
        className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800"
      >
        <Check className="w-5 h-5 text-green-500 mr-2" />
        <span className="text-green-800 dark:text-green-200">
          Email copied to clipboard!
        </span>
      </Toast>
    </SectionContainer>
  );
}
