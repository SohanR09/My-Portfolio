/**
 * This file contains all the data used throughout the application.
 * Centralizing data makes it easier to maintain and update content.
 */

import { Code, Globe, BookOpen, Users, Lightbulb } from "lucide-react"
import { FaReact, FaNodeJs, FaPython, FaAws } from "react-icons/fa"
import { SiTypescript, SiJavascript, SiMongodb, SiPostgresql, SiDocker, SiKubernetes } from "react-icons/si"

// About section data
export const ABOUT_ITEMS = [
  {
    title: "Passionate Developer",
    content: "With 5+ years of experience in crafting robust web applications.",
    icon: Code,
  },
  {
    title: "Tech Enthusiast",
    content: "Always exploring new technologies and methodologies in the ever-evolving tech landscape.",
    icon: Lightbulb,
  },
  {
    title: "Problem Solver",
    content: "Analytical thinker with a knack for developing innovative solutions to complex challenges.",
    icon: BookOpen,
  },
  {
    title: "Team Player",
    content: "Thrives in collaborative environments, bringing out the best in cross-functional teams.",
    icon: Users,
  },
  {
    title: "Global Perspective",
    content: "Worked on international projects spanning multiple time zones and cultures.",
    icon: Globe,
  },
]

// Experience section data
export const EXPERIENCES = [
  {
    company: "Arav System Pvt. Ltd.",
    logo: "",
    position: "Software Developer",
    period: "Apr 2021 - Mar 2023",
    description: "Conducted workload assessments and introduced new operational processes, boosting productivity by 40%. Worked on 4+ projects with a team of 14, ensuring efficient and timely project delivery.",
    skills: ["React", "Node.js", "Redux", "TypeScript", "REST APIs", "MongoDB", "MaterialUI","D3.js"],
  },
  {
    company: "ProCohat Technologies Pvt. Ltd.",
    logo: "",
    position: "React Developer Intern",
    period: "Aug 2020 - Sep 2020",
    description: "Designed and implemented a React JS interface with product search, checkout, and payment processing, completed within a one-month deadline. Created innovative features tailored to client and end-user needs.",
    skills: ["React", "Node.js", "Redux", "JavaScript", "REST APIs", "Firebase", "Bootstrap", "MongoDB"],
  },
]

// Projects section data
export const PROJECTS = [
  {
    name: "MedicoAId | GUI for real time Disease Detection and Patient Monitoring.",
    description: "This MERN stack project includes Disease Detection using AI/ML, IoT-based Patient Monitoring with real-time data via Firebase, and a Cross-Platform Application with PWA support. Built with ReactJS, Redux, Node.js, and Express.js, it ensures secure session management with JWT, and all data is stored in MongoDB.",
    image: "",
    skills: ["React", "Node.js", "REST Api", "MongoDB", "Redux"],
    github: "https://github.com/SohanR09/medicoaid-app",
    live: "https://www.youtube.com/watch?v=TJmkv_Qe9tY",
  },
  {
    name: "Live Document Editor Application",
    description: "Explore the wonders of generating documents and provided with a editor, which allows you to put comments. Also gives an additional feature of collaborating your documents with you peers.",
    image: "",
    skills: ["Next.js", "React", "Clerk", "Typescript", "Tailwind CSS"],
    github: "https://github.com/SohanR09/live_docs_dashboard",
    live: "https://live-docs-dashboard.vercel.app/sign-in",
  },
  {
    name: "Musify-now",
    description: "Experience the wide range of music albums and playlist. A dedicated and responsive design made on the spotify developer API.",
    image: "",
    skills: ["React", "Next.js", "Tailwind CSS", "Redux",],
    github: "https://github.com/SohanR09/musify",
    live: "https://musify-now.vercel.app/api/auth/signin",
  },
]

// Education section data
export const EDUCATIONS = [
  {
    university: "Government College of Engineering, Nagpur, Maharashtra, India",
    logo: "https://portfolio-sohan.vercel.app/collegeLogo/gcoenLogo.jpg",
    degree: "Bachelor's of Engineering in Computer Science",
    period: "2017 - 2021",
    cgpa: "9.7",
    subjects: ["Operating Systems", "Data Structure and Algorithm", " Computer Architecture and Organization", " Computer Networks", "Compiler Design", "Database Management Systems", "Digital Circuits", "Applied Mathematics"],
    description:
      `Focused on advanced algorithms and Software development applications. Completed thesis on "Blood Oxygen Level and Pulse Rate Monitoring Using IoT and Cloud-Based Data Storage".`,
  },
]

// Skills section data
export const SKILLS = [
  { name: "React", icon: FaReact },
  { name: "Node.js", icon: FaNodeJs },
  { name: "TypeScript", icon: SiTypescript },
  { name: "JavaScript", icon: SiJavascript },
  { name: "Python", icon: FaPython },
  { name: "MongoDB", icon: SiMongodb },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "AWS", icon: FaAws },
  { name: "Docker", icon: SiDocker },
  { name: "Kubernetes", icon: SiKubernetes },
]

