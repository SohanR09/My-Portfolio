import { FaReact, FaNodeJs, FaPython } from "react-icons/fa"
import { SiTypescript, SiJavascript, SiNextdotjs } from "react-icons/si"

export type BlogCategory = {
  id: string
  name: string
  icon: any
  count: number
}

export type BlogPost = {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  author: string
  authorImage: string
  category: string
  readTime: string
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    id: "react",
    name: "React",
    icon: FaReact,
    count: 1,
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: SiJavascript,
    count: 0,
  },
  {
    id: "typescript",
    name: "TypeScript",
    icon: SiTypescript,
    count: 1,
  },
  {
    id: "nextjs",
    name: "Next.js",
    icon: SiNextdotjs,
    count: 1,
  },
  {
    id: "nodejs",
    name: "Node.js",
    icon: FaNodeJs,
    count: 1,
  },
  {
    id: "python",
    name: "Python",
    icon: FaPython,
    count: 1,
  },
]

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "getting-started-with-react",
    title: "Getting Started with React: A Beginner's Guide",
    excerpt:
      "Learn the basics of React and how to create your first component in this comprehensive guide for beginners.",
    content: "\u003Ch1\u003EAchieving Financial Stability through Digital Products\u003C/h1\u003E\n\u003Cp\u003EFinancial stability is a goal that many of us strive for but can often seem elusive. One increasingly popular method for achieving this stability is through the creation and sale of digital products.\u003C/p\u003E\n\n\u003Cp\u003EDigital products can range from software applications to eBooks, online courses, and even digital art. The appeal lies in the fact that they can be created once and sold an infinite number of times, providing a scalable source of income.\u003C/p\u003E\n\n\u003Cblockquote\u003E\n  \u003Cp\u003E\"The best investment you can make is in yourself.\"\u003C/p\u003E\n\u003C/blockquote\u003E\n\n\u003Cp\u003EThe first step in creating a digital product is identifying a niche or target audience. Whether it's a tool that solves a specific problem or content that caters to a particular interest, having a clear target audience is crucial for success.\u003C/p\u003E\n\n\u003Cp\u003EOnce you have a concept, the next step is development. This phase may involve coding, content creation, and design work. The key is to create something that not only meets the needs of your target audience but also exceeds their expectations.\u003C/p\u003E\n\n\u003Cp\u003EMarketing is another critical aspect. No matter how great your product is, it won't sell if people don't know about it. Leveraging social media, SEO, and email marketing can go a long way in promoting your digital product.\u003C/p\u003E\n\n\u003Cp\u003EAnother essential consideration is pricing. Your pricing strategy can make or break your product, so it's crucial to get it right. Whether you choose a one-time payment model, a subscription-based model, or a freemium model, make sure it aligns with the value you're offering.\u003C/p\u003E\n\n\u003Cp\u003ECustomer service shouldn't be overlooked either. Providing excellent customer service can help you build trust and credibility, leading to more sales and positive reviews.\u003C/p\u003E\n\n\u003Cp\u003EIn conclusion, digital products offer a fantastic opportunity for achieving financial stability. With the right approach, they can provide a scalable and sustainable source of income that can last for years to come.\u003C/p\u003E\n",
    image: "/blog/react-beginners-guide.jpg",
    date: "2023-06-15",
    author: "Sohan Rathod",
    authorImage: "",
    category: "react",
    readTime: "8 min read",
  },
  {
    id: "typescript-vs-javascript",
    title: "TypeScript vs JavaScript: When to Use Each",
    excerpt: "Explore the differences between TypeScript and JavaScript and learn when to use each in your projects.",
    content: "\u003Ch1\u003EAchieving Financial Stability through Digital Products\u003C/h1\u003E\n\u003Cp\u003EFinancial stability is a goal that many of us strive for but can often seem elusive. One increasingly popular method for achieving this stability is through the creation and sale of digital products.\u003C/p\u003E\n\n\u003Cp\u003EDigital products can range from software applications to eBooks, online courses, and even digital art. The appeal lies in the fact that they can be created once and sold an infinite number of times, providing a scalable source of income.\u003C/p\u003E\n\n\u003Cblockquote\u003E\n  \u003Cp\u003E\"The best investment you can make is in yourself.\"\u003C/p\u003E\n\u003C/blockquote\u003E\n\n\u003Cp\u003EThe first step in creating a digital product is identifying a niche or target audience. Whether it's a tool that solves a specific problem or content that caters to a particular interest, having a clear target audience is crucial for success.\u003C/p\u003E\n\n\u003Cp\u003EOnce you have a concept, the next step is development. This phase may involve coding, content creation, and design work. The key is to create something that not only meets the needs of your target audience but also exceeds their expectations.\u003C/p\u003E\n\n\u003Cp\u003EMarketing is another critical aspect. No matter how great your product is, it won't sell if people don't know about it. Leveraging social media, SEO, and email marketing can go a long way in promoting your digital product.\u003C/p\u003E\n\n\u003Cp\u003EAnother essential consideration is pricing. Your pricing strategy can make or break your product, so it's crucial to get it right. Whether you choose a one-time payment model, a subscription-based model, or a freemium model, make sure it aligns with the value you're offering.\u003C/p\u003E\n\n\u003Cp\u003ECustomer service shouldn't be overlooked either. Providing excellent customer service can help you build trust and credibility, leading to more sales and positive reviews.\u003C/p\u003E\n\n\u003Cp\u003EIn conclusion, digital products offer a fantastic opportunity for achieving financial stability. With the right approach, they can provide a scalable and sustainable source of income that can last for years to come.\u003C/p\u003E\n",
    image: "/blog/typescript-vs-javascript.jpg",
    date: "2023-07-22",
    author: "Sohan Rathod",
    authorImage: "/john-smith-profile.jpg",
    category: "typescript",
    readTime: "10 min read",
  },
  {
    id: "nextjs-13-app-router",
    title: "Understanding Next.js 13 App Router",
    excerpt: "Dive into the new App Router in Next.js 13 and learn how it improves your development experience.",
    content: "\u003Ch1\u003EAchieving Financial Stability through Digital Products\u003C/h1\u003E\n\u003Cp\u003EFinancial stability is a goal that many of us strive for but can often seem elusive. One increasingly popular method for achieving this stability is through the creation and sale of digital products.\u003C/p\u003E\n\n\u003Cp\u003EDigital products can range from software applications to eBooks, online courses, and even digital art. The appeal lies in the fact that they can be created once and sold an infinite number of times, providing a scalable source of income.\u003C/p\u003E\n\n\u003Cblockquote\u003E\n  \u003Cp\u003E\"The best investment you can make is in yourself.\"\u003C/p\u003E\n\u003C/blockquote\u003E\n\n\u003Cp\u003EThe first step in creating a digital product is identifying a niche or target audience. Whether it's a tool that solves a specific problem or content that caters to a particular interest, having a clear target audience is crucial for success.\u003C/p\u003E\n\n\u003Cp\u003EOnce you have a concept, the next step is development. This phase may involve coding, content creation, and design work. The key is to create something that not only meets the needs of your target audience but also exceeds their expectations.\u003C/p\u003E\n\n\u003Cp\u003EMarketing is another critical aspect. No matter how great your product is, it won't sell if people don't know about it. Leveraging social media, SEO, and email marketing can go a long way in promoting your digital product.\u003C/p\u003E\n\n\u003Cp\u003EAnother essential consideration is pricing. Your pricing strategy can make or break your product, so it's crucial to get it right. Whether you choose a one-time payment model, a subscription-based model, or a freemium model, make sure it aligns with the value you're offering.\u003C/p\u003E\n\n\u003Cp\u003ECustomer service shouldn't be overlooked either. Providing excellent customer service can help you build trust and credibility, leading to more sales and positive reviews.\u003C/p\u003E\n\n\u003Cp\u003EIn conclusion, digital products offer a fantastic opportunity for achieving financial stability. With the right approach, they can provide a scalable and sustainable source of income that can last for years to come.\u003C/p\u003E\n",
    image: "/blog/nextjs-app-router.jpg",
    date: "2023-08-05",
    author: "Sohan Rathod",
    authorImage: "/john-smith-profile.jpg",
    category: "nextjs",
    readTime: "12 min read",
  },
  {
    id: "nodejs-microservices",
    title: "Building Microservices with Node.js",
    excerpt: "Learn how to design and implement a microservices architecture using Node.js and Express.",
    content: "\u003Ch1\u003EAchieving Financial Stability through Digital Products\u003C/h1\u003E\n\u003Cp\u003EFinancial stability is a goal that many of us strive for but can often seem elusive. One increasingly popular method for achieving this stability is through the creation and sale of digital products.\u003C/p\u003E\n\n\u003Cp\u003EDigital products can range from software applications to eBooks, online courses, and even digital art. The appeal lies in the fact that they can be created once and sold an infinite number of times, providing a scalable source of income.\u003C/p\u003E\n\n\u003Cblockquote\u003E\n  \u003Cp\u003E\"The best investment you can make is in yourself.\"\u003C/p\u003E\n\u003C/blockquote\u003E\n\n\u003Cp\u003EThe first step in creating a digital product is identifying a niche or target audience. Whether it's a tool that solves a specific problem or content that caters to a particular interest, having a clear target audience is crucial for success.\u003C/p\u003E\n\n\u003Cp\u003EOnce you have a concept, the next step is development. This phase may involve coding, content creation, and design work. The key is to create something that not only meets the needs of your target audience but also exceeds their expectations.\u003C/p\u003E\n\n\u003Cp\u003EMarketing is another critical aspect. No matter how great your product is, it won't sell if people don't know about it. Leveraging social media, SEO, and email marketing can go a long way in promoting your digital product.\u003C/p\u003E\n\n\u003Cp\u003EAnother essential consideration is pricing. Your pricing strategy can make or break your product, so it's crucial to get it right. Whether you choose a one-time payment model, a subscription-based model, or a freemium model, make sure it aligns with the value you're offering.\u003C/p\u003E\n\n\u003Cp\u003ECustomer service shouldn't be overlooked either. Providing excellent customer service can help you build trust and credibility, leading to more sales and positive reviews.\u003C/p\u003E\n\n\u003Cp\u003EIn conclusion, digital products offer a fantastic opportunity for achieving financial stability. With the right approach, they can provide a scalable and sustainable source of income that can last for years to come.\u003C/p\u003E\n",
    image: "/blog/nodejs-microservices.jpg",
    date: "2023-09-10",
    author: "Sohan Rathod",
    authorImage: "/john-smith-profile.jpg",
    category: "nodejs",
    readTime: "15 min read",
  },
  {
    id: "python-data-analysis",
    title: "Data Analysis with Python: Pandas and NumPy",
    excerpt: "Explore how to use Python's powerful libraries for data analysis and manipulation.",
    content: "\u003Ch1\u003EAchieving Financial Stability through Digital Products\u003C/h1\u003E\n\u003Cp\u003EFinancial stability is a goal that many of us strive for but can often seem elusive. One increasingly popular method for achieving this stability is through the creation and sale of digital products.\u003C/p\u003E\n\n\u003Cp\u003EDigital products can range from software applications to eBooks, online courses, and even digital art. The appeal lies in the fact that they can be created once and sold an infinite number of times, providing a scalable source of income.\u003C/p\u003E\n\n\u003Cblockquote\u003E\n  \u003Cp\u003E\"The best investment you can make is in yourself.\"\u003C/p\u003E\n\u003C/blockquote\u003E\n\n\u003Cp\u003EThe first step in creating a digital product is identifying a niche or target audience. Whether it's a tool that solves a specific problem or content that caters to a particular interest, having a clear target audience is crucial for success.\u003C/p\u003E\n\n\u003Cp\u003EOnce you have a concept, the next step is development. This phase may involve coding, content creation, and design work. The key is to create something that not only meets the needs of your target audience but also exceeds their expectations.\u003C/p\u003E\n\n\u003Cp\u003EMarketing is another critical aspect. No matter how great your product is, it won't sell if people don't know about it. Leveraging social media, SEO, and email marketing can go a long way in promoting your digital product.\u003C/p\u003E\n\n\u003Cp\u003EAnother essential consideration is pricing. Your pricing strategy can make or break your product, so it's crucial to get it right. Whether you choose a one-time payment model, a subscription-based model, or a freemium model, make sure it aligns with the value you're offering.\u003C/p\u003E\n\n\u003Cp\u003ECustomer service shouldn't be overlooked either. Providing excellent customer service can help you build trust and credibility, leading to more sales and positive reviews.\u003C/p\u003E\n\n\u003Cp\u003EIn conclusion, digital products offer a fantastic opportunity for achieving financial stability. With the right approach, they can provide a scalable and sustainable source of income that can last for years to come.\u003C/p\u003E\n",
    image: "/blog/python-data-analysis.jpg",
    date: "2023-10-18",
    author: "Sohan Rathod",
    authorImage: "/john-smith-profile.jpg",
    category: "python",
    readTime: "11 min read",
  },
]

