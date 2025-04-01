import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
// Update this import
import { updateSchemaSQL } from "@/db/update-schema"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Create tables if they don't exist
    await createTables(supabase)

    // Update schema with sequence fields
    try {
      await supabase.rpc("execute_sql", { sql: updateSchemaSQL })
    } catch (error) {
      console.error("Error updating schema:", error)
      // Continue anyway, as this is not critical
    }

    // Seed data
    await seedData(supabase)

    return NextResponse.json({ success: true, message: "Database initialized successfully" })
  } catch (error: any) {
    console.error("Error initializing database:", error)
    // Return a proper JSON response even on error
    return NextResponse.json({ success: false, error: error.message || "Unknown error occurred" }, { status: 500 })
  }
}

async function createTables(supabase: any) {
  try {
    // Create updated_at function
    const { error: functionError } = await supabase
      .rpc("create_updated_at_function", {
        function_sql: `
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `,
      })
      .single()

    if (functionError) {
      console.warn("Warning creating function (may already exist):", functionError.message)
    }

    // Create about_items table
    const { error: aboutItemsError } = await supabase.from("about_items").select("id").limit(1)

    if (aboutItemsError && aboutItemsError.code === "42P01") {
      // Table doesn't exist
      const { error } = await supabase.rpc("create_about_items_table")
      if (error) throw new Error(`Error creating about_items table: ${error.message}`)
    }

    // Create skills table
    const { error: skillsError } = await supabase.from("skills").select("id").limit(1)

    if (skillsError && skillsError.code === "42P01") {
      // Table doesn't exist
      const { error } = await supabase.rpc("create_skills_table")
      if (error) throw new Error(`Error creating skills table: ${error.message}`)
    }

    // Create experiences table
    const { error: experiencesError } = await supabase.from("experiences").select("id").limit(1)

    if (experiencesError && experiencesError.code === "42P01") {
      // Table doesn't exist
      const { error } = await supabase.rpc("create_experiences_table")
      if (error) throw new Error(`Error creating experiences table: ${error.message}`)
    }

    // Create education table
    const { error: educationError } = await supabase.from("education").select("id").limit(1)

    if (educationError && educationError.code === "42P01") {
      // Table doesn't exist
      const { error } = await supabase.rpc("create_education_table")
      if (error) throw new Error(`Error creating education table: ${error.message}`)
    }

    // Create projects table
    const { error: projectsError } = await supabase.from("projects").select("id").limit(1)

    if (projectsError && projectsError.code === "42P01") {
      // Table doesn't exist
      const { error } = await supabase.rpc("create_projects_table")
      if (error) throw new Error(`Error creating projects table: ${error.message}`)
    }

    // Create blog_categories table
    const { error: blogCategoriesError } = await supabase.from("blog_categories").select("id").limit(1)

    if (blogCategoriesError && blogCategoriesError.code === "42P01") {
      // Table doesn't exist
      const { error } = await supabase.rpc("create_blog_categories_table")
      if (error) throw new Error(`Error creating blog_categories table: ${error.message}`)
    }

    // Create blog_posts table
    const { error: blogPostsError } = await supabase.from("blog_posts").select("id").limit(1)

    if (blogPostsError && blogPostsError.code === "42P01") {
      // Table doesn't exist
      const { error } = await supabase.rpc("create_blog_posts_table")
      if (error) throw new Error(`Error creating blog_posts table: ${error.message}`)
    }

    // Set RLS policies
    await setRLSPolicies(supabase)
  } catch (error: any) {
    throw new Error(`Error in createTables: ${error.message}`)
  }
}

async function setRLSPolicies(supabase: any) {
  try {
    // Enable RLS on all tables
    const tables = ["about_items", "skills", "experiences", "education", "projects", "blog_categories", "blog_posts"]

    for (const table of tables) {
      // Enable RLS
      await supabase.rpc("enable_rls", { table_name: table })

      // Create read policy
      await supabase.rpc("create_read_policy", {
        table_name: table,
        policy_name: "Allow anonymous read access",
      })

      // Create write policy
      await supabase.rpc("create_write_policy", {
        table_name: table,
        policy_name: "Allow authenticated users full access",
      })
    }
  } catch (error: any) {
    console.warn("Warning setting RLS policies:", error.message)
  }
}

async function seedData(supabase: any) {
  try {
    // Seed About Items
    const { error: aboutError } = await supabase.from("about_items").upsert([
      {
        title: "Passionate Developer",
        content:
          "With 5+ years of experience in crafting robust web applications and a deep love for clean, efficient code.",
        icon: "Code",
      },
      {
        title: "Tech Enthusiast",
        content:
          "Always exploring new technologies and methodologies in the ever-evolving tech landscape to stay at the cutting edge.",
        icon: "Lightbulb",
      },
      {
        title: "Problem Solver",
        content:
          "Analytical thinker with a knack for developing innovative solutions to complex challenges and technical problems.",
        icon: "BookOpen",
      },
      {
        title: "Team Player",
        content:
          "Thrives in collaborative environments, bringing out the best in cross-functional teams and fostering positive work culture.",
        icon: "Users",
      },
      {
        title: "Global Perspective",
        content:
          "Worked on international projects spanning multiple time zones and cultures, bringing a diverse viewpoint to every project.",
        icon: "Globe",
      },
    ])
    if (aboutError) throw new Error(`Error seeding about items: ${aboutError.message}`)

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
      { name: "Next.js", icon: "SiNextdotjs" },
      { name: "GraphQL", icon: "SiGraphql" },
    ])
    if (skillsError) throw new Error(`Error seeding skills: ${skillsError.message}`)

    // Seed Experiences
    const { error: experiencesError } = await supabase.from("experiences").upsert([
      {
        company: "Innovative Tech Solutions",
        logo: "https://placehold.co/200x200?text=ITS",
        position: "Senior Full Stack Developer",
        period: "Jan 2021 - Present",
        description:
          "Leading development of cloud-native applications using React, Node.js, and AWS. Implemented CI/CD pipelines that reduced deployment time by 40%. Mentored junior developers and conducted code reviews to maintain high code quality standards.",
        skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "CI/CD", "MongoDB", "Redis"],
      },
      {
        company: "Digital Dynamics Inc.",
        logo: "https://placehold.co/200x200?text=DDI",
        position: "Frontend Developer",
        period: "Mar 2019 - Dec 2020",
        description:
          "Developed responsive web applications using React and Redux. Collaborated with UX designers to implement pixel-perfect interfaces. Reduced application load time by 30% through code optimization and lazy loading techniques.",
        skills: ["React", "Redux", "JavaScript", "SASS", "Webpack", "Jest", "RESTful APIs"],
      },
      {
        company: "TechStart Solutions",
        logo: "https://placehold.co/200x200?text=TSS",
        position: "Web Developer Intern",
        period: "Jun 2018 - Feb 2019",
        description:
          "Assisted in developing and maintaining client websites. Created interactive UI components and implemented responsive designs. Participated in daily stand-ups and sprint planning meetings.",
        skills: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap", "PHP", "MySQL"],
      },
    ])
    if (experiencesError) throw new Error(`Error seeding experiences: ${experiencesError.message}`)

    // Seed Education
    const { error: educationError } = await supabase.from("education").upsert([
      {
        university: "Massachusetts Institute of Technology",
        logo: "https://placehold.co/200x200?text=MIT",
        degree: "Master of Science in Computer Science",
        period: "2016 - 2018",
        cgpa: "3.8",
        subjects: ["Advanced Algorithms", "Machine Learning", "Distributed Systems", "Cloud Computing", "Data Science"],
        description:
          "Focused on distributed systems and cloud computing. Completed thesis on 'Optimizing Microservice Architectures for Cloud Environments' with distinction.",
      },
      {
        university: "University of California, Berkeley",
        logo: "https://placehold.co/200x200?text=UCB",
        degree: "Bachelor of Science in Computer Science",
        period: "2012 - 2016",
        cgpa: "3.7",
        subjects: [
          "Data Structures",
          "Algorithms",
          "Operating Systems",
          "Database Systems",
          "Web Development",
          "Computer Networks",
        ],
        description:
          "Graduated with honors. Active member of the Computer Science Student Association. Participated in multiple hackathons and coding competitions.",
      },
    ])
    if (educationError) throw new Error(`Error seeding education: ${educationError.message}`)

    // Seed Projects
    const { error: projectsError } = await supabase.from("projects").upsert([
      {
        name: "CloudSync - Real-time Collaboration Platform",
        description:
          "A real-time collaboration platform built with React, Node.js, and Socket.io. Features include document editing, video conferencing, and project management tools. Implemented WebRTC for peer-to-peer communication and used Redis for pub/sub messaging.",
        image: "https://placehold.co/800x400?text=CloudSync",
        skills: ["React", "Node.js", "Socket.io", "Redis", "MongoDB", "WebRTC", "Docker"],
        github: "https://github.com/johnsmith/cloudsync",
        live: "https://cloudsync-demo.vercel.app",
      },
      {
        name: "HealthTrack - Fitness Monitoring App",
        description:
          "A comprehensive fitness tracking application that integrates with wearable devices. Built with React Native and Firebase. Implemented machine learning algorithms to provide personalized workout and nutrition recommendations.",
        image: "https://placehold.co/800x400?text=HealthTrack",
        skills: ["React Native", "Firebase", "TensorFlow.js", "Node.js", "Express", "MongoDB"],
        github: "https://github.com/johnsmith/healthtrack",
        live: "https://healthtrack-app.com",
      },
      {
        name: "CodeReview - Automated Code Analysis Tool",
        description:
          "An automated code review tool that analyzes code quality, identifies potential bugs, and suggests improvements. Built with Python and TypeScript. Integrates with GitHub and GitLab through webhooks.",
        image: "https://placehold.co/800x400?text=CodeReview",
        skills: ["Python", "TypeScript", "Docker", "AWS Lambda", "GitHub API", "Machine Learning"],
        github: "https://github.com/johnsmith/codereview",
        live: "https://codereview-tool.dev",
      },
      {
        name: "EcoMarket - Sustainable Shopping Platform",
        description:
          "An e-commerce platform focused on eco-friendly and sustainable products. Features include carbon footprint tracking, ethical brand verification, and community reviews. Built with Next.js and PostgreSQL.",
        image: "https://placehold.co/800x400?text=EcoMarket",
        skills: ["Next.js", "PostgreSQL", "Stripe API", "Tailwind CSS", "Vercel", "GraphQL"],
        github: "https://github.com/johnsmith/ecomarket",
        live: "https://ecomarket-shop.vercel.app",
      },
    ])
    if (projectsError) throw new Error(`Error seeding projects: ${projectsError.message}`)

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
        { name: "DevOps", icon: "SiDocker" },
        { name: "Career", icon: "Briefcase" },
      ])
      .select()
    if (categoriesError) throw new Error(`Error seeding blog categories: ${categoriesError.message}`)

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
          title: "Building Scalable React Applications with TypeScript",
          excerpt:
            "Learn how to structure large-scale React applications with TypeScript for better maintainability and type safety.",
          content: "",
          image: "https://placehold.co/800x400?text=React+TypeScript",
          date: "2023-10-15",
          author: "John Smith",
          author_image: "https://placehold.co/200x200?text=JS",
          category_id: categoryMap["typescript"],
          read_time: "8 min read",
        },
        {
          title: "Mastering Next.js 13 App Router",
          excerpt: "Dive into the new App Router in Next.js 13 and learn how it improves your development experience.",
          content: "",
          image: "https://placehold.co/800x400?text=Next.js+13",
          date: "2023-09-22",
          author: "John Smith",
          author_image: "https://placehold.co/200x200?text=JS",
          category_id: categoryMap["next.js"],
          read_time: "10 min read",
        },
        {
          title: "Optimizing Node.js Applications for Production",
          excerpt:
            "Learn essential techniques to optimize your Node.js applications for performance, security, and reliability in production environments.",
          content: "",
          image: "https://placehold.co/800x400?text=Node.js+Optimization",
          date: "2023-08-18",
          author: "John Smith",
          author_image: "https://placehold.co/200x200?text=JS",
          category_id: categoryMap["node.js"],
          read_time: "12 min read",
        },
      ])
      if (postsError) throw new Error(`Error seeding blog posts: ${postsError.message}`)
    }
  } catch (error: any) {
    throw new Error(`Error in seedData: ${error.message}`)
  }
}

