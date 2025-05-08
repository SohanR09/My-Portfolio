"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionTitle } from "@/components/ui/section-title";
import { SECTION_TITLES } from "@/constants";
import { Briefcase } from "lucide-react";
import { getSkillIcon } from "@/utils/text-utils";
import { getSupabaseClient } from "@/lib/supabase/client";

type Experience = {
  id: string;
  company: string;
  logo: string | null;
  position: string;
  period: string;
  description: string;
  skills: string[];
};

/**
 * Experience section component that displays professional experience
 * with company logos, positions, and skills.
 */
export default function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExperiences() {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from("experiences")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching experiences:", error);
          setError("Unable to load experiences at this time");
          setExperiences([]);
        } else {
          setExperiences(data as any[]);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to fetch experiences:", err);
        setError("Unable to load experiences at this time");
        setExperiences([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchExperiences();
  }, []);

  if (isLoading) {
    return (
      <SectionContainer id="experience" background="primary">
        <SectionTitle title={SECTION_TITLES.experience} />
        <div className="space-y-12">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start">
                <div className="mb-4 md:mb-0 md:mr-6">
                  <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                </div>
                <div className="flex-grow">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                  <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/5 mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="flex flex-wrap gap-2">
                    {[...Array(4)].map((_, skillIndex) => (
                      <div
                        key={skillIndex}
                        className="h-8 bg-gray-300 dark:bg-gray-700 rounded-full w-20"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>
    );
  }

  // If no experiences are found, show a fallback message
  if (experiences.length === 0) {
    return (
      <SectionContainer id="experience" background="primary">
        <SectionTitle title={SECTION_TITLES.experience} />
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {error ||
              "Experience information will be available soon. Please check back later."}
          </p>
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer id="experience" background="primary">
      <SectionTitle title={SECTION_TITLES.experience} />
      <div className="space-y-12">
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <div className="mb-4 md:mb-0 md:mr-6">
                <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  {exp.logo ? (
                    <Image
                      src={exp.logo || "/placeholder.svg"}
                      alt={`${exp.company} logo`}
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                  ) : (
                    <Briefcase className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                  )}
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {exp.company}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {exp.position}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {exp.period}
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  {exp.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill, skillIndex) => (
                    <Badge
                      key={skillIndex}
                      variant="secondary"
                      className="flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-3 py-1"
                    >
                      {getSkillIcon(skill)}
                      <span>{skill}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  );
}
