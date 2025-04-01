import { createServerSupabaseClient } from "./server"

export async function seedDatabase() {
  const supabase = createServerSupabaseClient()

  // Seed About Items
  const { error: aboutError } = await supabase.from("about_items").upsert([
    {
      title: "Passionate Developer",
      content: "With 5+ years of experience in crafting robust web applications.",
      icon: "Code",
    },
    {
      title: "Tech Enthusiast",
      content: "Always exploring new technologies and methodologies in the ever-evolving tech landscape.",
      icon: "Lightbulb",
    },
    {
      title: "Problem Solver",
      content: "Analytical thinker with a knack for developing innovative solutions to complex challenges.",
      icon: "BookOpen",
    },
    {
      title: "Team Player",
      content: "Thrives in collaborative environments, bringing out the best in cross-functional teams.",
      icon: "Users",
    },
    {
      title: "Global Perspective",
      content: "Worked on international projects spanning multiple time zones and cultures.",
      icon: "Globe",
    },
  ])

  if (aboutError) console.error("Error seeding about items:", aboutError)

  // Seed Skills
  const { error: skillsError } = await supabase.from("skills").upsert([
    { name: "React", icon: "FaReact" },
    { name: "Node.js", icon: "FaNodeJs" },
    { name: "TypeScript", icon: "SiTypescript" },
    { name: "JavaScript", icon: "SiJavascript" },
    { name: "Python", icon: "FaPython" },
    { name: "MongoDB", icon: "SiMongodb" },
    { name: "PostgreSQL", icon: "SiPostgresql" },
    { name: "AWS", icon: "FaAws" },
    { name: "Docker", icon: "SiDocker" },
    { name: "Kubernetes", icon: "SiKubernetes" },
  ])

  if (skillsError) console.error("Error seeding skills:", skillsError)

  // Seed Experiences
  const { error: experiencesError } = await supabase.from("experiences").upsert([
    {
      company: "Arav System Pvt. Ltd.",
      logo: "",
      position: "Software Developer",
      period: "Apr 2021 - Mar 2023",
      description:
        "Conducted workload assessments and introduced new operational processes, boosting productivity by 40%. Worked on 4+ projects with a team of 14, ensuring efficient and timely project delivery.",
      skills: ["React", "Node.js", "Redux", "TypeScript", "REST APIs", "MongoDB", "MaterialUI", "D3.js"],
    },
    {
      company: "ProCohat Technologies Pvt. Ltd.",
      logo: "",
      position: "React Developer Intern",
      period: "Aug 2020 - Sep 2020",
      description:
        "Designed and implemented a React JS interface with product search, checkout, and payment processing, completed within a one-month deadline. Created innovative features tailored to client and end-user needs.",
      skills: ["React", "Node.js", "Redux", "JavaScript", "REST APIs", "Firebase", "Bootstrap", "MongoDB"],
    },
  ])

  if (experiencesError) console.error("Error seeding experiences:", experiencesError)

  // Seed Education
  const { error: educationError } = await supabase.from("education").upsert([
    {
      university: "Government College of Engineering, Nagpur, Maharashtra, India",
      logo: "https://portfolio-sohan.vercel.app/collegeLogo/gcoenLogo.jpg",
      degree: "Bachelor's of Engineering in Computer Science",
      period: "2017 - 2021",
      cgpa: "9.7",
      subjects: [
        "Operating Systems",
        "Data Structure and Algorithm",
        "Computer Architecture and Organization",
        "Computer Networks",
        "Compiler Design",
        "Database Management Systems",
        "Digital Circuits",
        "Applied Mathematics",
      ],
      description: `Focused on advanced algorithms and Software development applications. Completed thesis on "Blood Oxygen Level and Pulse Rate Monitoring Using IoT and Cloud-Based Data Storage".`,
    },
  ])

  if (educationError) console.error("Error seeding education:", educationError)

  // Seed Projects
  const { error: projectsError } = await supabase.from("projects").upsert([
    {
      name: "MedicoAId | GUI for real time Disease Detection and Patient Monitoring.",
      description:
        "This MERN stack project includes Disease Detection using AI/ML, IoT-based Patient Monitoring with real-time data via Firebase, and a Cross-Platform Application with PWA support. Built with ReactJS, Redux, Node.js, and Express.js, it ensures secure session management with JWT, and all data is stored in MongoDB.",
      image: "",
      skills: ["React", "Node.js", "REST Api", "MongoDB", "Redux"],
      github: "https://github.com/SohanR09/medicoaid-app",
      live: "https://www.youtube.com/watch?v=TJmkv_Qe9tY",
    },
    {
      name: "Live Document Editor Application",
      description:
        "Explore the wonders of generating documents and provided with a editor, which allows you to put comments. Also gives an additional feature of collaborating your documents with you peers.",
      image: "",
      skills: ["Next.js", "React", "Clerk", "Typescript", "Tailwind CSS"],
      github: "https://github.com/SohanR09/live_docs_dashboard",
      live: "https://live-docs-dashboard.vercel.app/sign-in",
    },
    {
      name: "Musify-now",
      description:
        "Experience the wide range of music albums and playlist. A dedicated and responsive design made on the spotify developer API.",
      image: "",
      skills: ["React", "Next.js", "Tailwind CSS", "Redux"],
      github: "https://github.com/SohanR09/musify",
      live: "https://musify-now.vercel.app/api/auth/signin",
    },
  ])

  if (projectsError) console.error("Error seeding projects:", projectsError)

  // Seed Blog Categories
  const { data: categories, error: categoriesError } = await supabase
    .from("blog_categories")
    .upsert([
      { name: "React", icon: "FaReact" },
      { name: "JavaScript", icon: "SiJavascript" },
      { name: "TypeScript", icon: "SiTypescript" },
      { name: "Next.js", icon: "SiNextdotjs" },
      { name: "Node.js", icon: "FaNodeJs" },
      { name: "Python", icon: "FaPython" },
    ])
    .select()

  if (categoriesError) console.error("Error seeding blog categories:", categoriesError)

  // If categories were successfully created, seed blog posts
  if (categories) {
    const categoryMap = categories.reduce(
      (acc, category) => {
        acc[category.name.toLowerCase()] = category.id
        return acc
      },
      {} as Record<string, string>,
    )

    const { error: postsError } = await supabase.from("blog_posts").upsert([
      {
        title: "Getting Started with React: A Beginner's Guide",
        excerpt:
          "Learn the basics of React and how to create your first component in this comprehensive guide for beginners.",
        content:
          "# Getting Started with React\n\nReact is a popular JavaScript library for building user interfaces...",
        image: "/blog/react-beginners-guide.jpg",
        date: "2023-06-15",
        author: "Sohan Rathod",
        author_image: "/john-smith-profile.jpg",
        category_id: categoryMap["react"],
        read_time: "8 min read",
      },
      {
        title: "TypeScript vs JavaScript: When to Use Each",
        excerpt:
          "Explore the differences between TypeScript and JavaScript and learn when to use each in your projects.",
        content: "# TypeScript vs JavaScript\n\nJavaScript has been the language of the web for decades...",
        image: "/blog/typescript-vs-javascript.jpg",
        date: "2023-07-22",
        author: "Sohan Rathod",
        author_image: "/john-smith-profile.jpg",
        category_id: categoryMap["typescript"],
        read_time: "10 min read",
      },
      {
        title: "Understanding Next.js 13 App Router",
        excerpt: "Dive into the new App Router in Next.js 13 and learn how it improves your development experience.",
        content:
          "# Understanding Next.js 13 App Router\n\nNext.js 13 introduced a new App Router built on React Server Components...",
        image: "/blog/nextjs-app-router.jpg",
        date: "2023-08-05",
        author: "Sohan Rathod",
        author_image: "/john-smith-profile.jpg",
        category_id: categoryMap["next.js"],
        read_time: "12 min read",
      },
      {
        title: "Building Microservices with Node.js",
        excerpt: "Learn how to design and implement a microservices architecture using Node.js and Express.",
        content:
          "# Building Microservices with Node.js\n\nMicroservices architecture has become increasingly popular...",
        image: "/blog/nodejs-microservices.jpg",
        date: "2023-09-10",
        author: "Sohan Rathod",
        author_image: "/john-smith-profile.jpg",
        category_id: categoryMap["node.js"],
        read_time: "15 min read",
      },
      {
        title: "Data Analysis with Python: Pandas and NumPy",
        excerpt: "Explore how to use Python's powerful libraries for data analysis and manipulation.",
        content: "# Data Analysis with Python\n\nPython has become the go-to language for data analysis...",
        image: "/blog/python-data-analysis.jpg",
        date: "2023-10-18",
        author: "Sohan Rathod",
        author_image: "/john-smith-profile.jpg",
        category_id: categoryMap["python"],
        read_time: "11 min read",
      },
    ])

    if (postsError) console.error("Error seeding blog posts:", postsError)
  }

  console.log("Database seeding completed")
}

