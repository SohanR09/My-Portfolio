import {
  FaReact,
  FaNodeJs,
  FaJs,
  FaPython,
  FaDatabase,
  FaAws,
  FaDocker,
  FaCloud,
  FaGithub,
  FaCode,
} from "react-icons/fa"
import { SiTypescript, SiMongodb, SiPostgresql, SiKubernetes, SiNextdotjs, SiTailwindcss, SiNestjs, SiExpress, SiNodedotjs, SiSupabase, SiGithub, SiGit, SiFigma } from "react-icons/si"
import type { IconType } from "react-icons"

export function getIconByName(iconName: string): IconType | null {
  const iconMap: Record<string, IconType> = {
    FaReact: FaReact,
    FaNodeJs: FaNodeJs,
    FaJs: FaJs,
    FaPython: FaPython,
    FaDatabase: FaDatabase,
    FaAws: FaAws,
    FaDocker: FaDocker,
    FaCloud: FaCloud,
    FaGithub: FaGithub,
    FaCode: FaCode,
    SiTypescript: SiTypescript,
    SiMongodb: SiMongodb,
    SiPostgresql: SiPostgresql,
    SiKubernetes: SiKubernetes,
    SiNextjs: SiNextdotjs,
    SiTailwindcss: SiTailwindcss,
    SiExpress: SiExpress,
    SiNestjs: SiNestjs,
    SiNodedotjs: SiNodedotjs,
    SiSupabase: SiSupabase,
    SiFigma: SiFigma,
    SiGit: SiGit,
    SiGithub: SiGithub
  }

  return iconMap[iconName] || null
}

