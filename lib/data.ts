import {
  BarChart3,
  Blocks,
  Bot,
  Box,
  BriefcaseBusiness,
  Cloud,
  Code2,
  Database,
  Flame,
  FolderGit2,
  Globe,
  GraduationCap,
  LayoutGrid,
  MonitorCog,
  Network,
  Server,
  Sparkles,
  Terminal,
  Wind,
  Wrench,
} from "lucide-react";

export const personalInfo = {
  name: "Ashraful Islam Ashik",
  title: "DevOps Engineer",
  shortBio:
    "DevOps Engineer focused on building scalable cloud infrastructure, deployment automation, CI/CD pipelines, container orchestration, and observability-driven systems.",
  longBio:
    "I am a DevOps Engineer with hands-on experience in cloud infrastructure, automation, container orchestration, monitoring, and deployment workflows. I enjoy building reliable systems, automating delivery pipelines, and improving platform visibility using AWS, Docker, Kubernetes, Terraform, Ansible, CI/CD, Prometheus, Grafana, Linux, and Nginx.",
  company: "SDB IT",
  location: "Dhaka, Bangladesh",
  email: "ashrafulislamashik960@gmail.com",
  github: "https://github.com/ashraful2430",
  linkedin: "https://www.linkedin.com/in/ashraful-islam-ashik-7085a22a0/",
  seeResume:
    "https://drive.google.com/file/d/1d8hiVx9zFzWNxReLttSf4--uo_rWtrA4/view?usp=sharing",
  downloadResume:
    "https://drive.usercontent.google.com/u/0/uc?id=1d8hiVx9zFzWNxReLttSf4--uo_rWtrA4&export=download",
  downloadResumeFileName: "Ashraful Islam Ashik Resume.pdf",
};

export const skillCategories = ["MERN", "DevOps"] as const;

export const mernSkills = [
  { name: "HTML", icon: Code2 },
  { name: "CSS", icon: LayoutGrid },
  { name: "JavaScript", icon: Sparkles },
  { name: "React", icon: Blocks },
  { name: "Tailwind", icon: Wind },
  { name: "MongoDB", icon: Database },
  { name: "Node.js", icon: Server },
  { name: "Express", icon: Network },
  { name: "Firebase", icon: Flame },
  { name: "GitHub", icon: FolderGit2 },
  { name: "Git", icon: FolderGit2 },
  { name: "Netlify", icon: Globe },
  { name: "DaisyUI", icon: Sparkles },
];

export const devopsSkills = [
  { name: "AWS", icon: Cloud },
  { name: "Docker", icon: Box },
  { name: "Kubernetes", icon: Blocks },
  { name: "Terraform", icon: Wrench },
  { name: "Ansible", icon: Bot },
  { name: "Jenkins", icon: BriefcaseBusiness },
  { name: "ArgoCD (GitOps)", icon: FolderGit2 },
  { name: "Prometheus", icon: BarChart3 },
  { name: "Grafana", icon: MonitorCog },
  { name: "Nginx", icon: Globe },
  { name: "GitHub", icon: FolderGit2 },
  { name: "GitLab CI/CD", icon: FolderGit2 },
  { name: "Linux", icon: Terminal },
  { name: "PostgreSQL", icon: Database },
  { name: "MongoDB", icon: Database },
];

export const projects = [
  {
    id: 1,
    slug: "chat-canvas",
    title: "Chat Canvas",
    subtitle: "An online platform to discuss various topics",
    image: "/projects/chat-canvas.png",
    liveUrl: "https://chat-canvas-725c3.web.app",
    clientUrl: "https://github.com/ashraful2430/chat-canvas",
    serverUrl: "https://github.com/ashraful2430/chat-canvas-backend",
    description:
      "A full-stack discussion platform where users can create posts, interact with the community, and explore topic-based conversations in a clean and engaging interface.",
    features: [
      "Basic features like liking, disliking, commenting, and sharing require user authentication.",
      "Users can make up to 5 posts without a membership, while membership allows unlimited posts.",
      "Users can search posts based on tags for faster discovery.",
      "Admins can view logged-in users for management and analysis, with username-based search support.",
    ],
    technologies: [
      "React",
      "Tailwind",
      "DaisyUI",
      "Stripe",
      "Firebase",
      "MongoDB",
      "Express.js",
      "Node.js",
    ],
  },
  {
    id: 2,
    slug: "learn-it-writ-it",
    title: "Learn It Writ It",
    subtitle: "An online platform to create and submit assignments",
    image: "/projects/learn-it-writ-it.png",
    liveUrl: "https://glistening-nasturtium-e44e6f.netlify.app",
    clientUrl: "https://github.com/ashraful2430/assignment-website-client",
    serverUrl: "https://github.com/ashraful2430/assignment-website-server",
    description:
      "A web platform designed for assignment creation, submission, and evaluation, making the workflow easier for both creators and participants.",
    features: [
      "Users can create assignments with details such as questions, difficulty level, and requirements.",
      "Users can take assignments, submit answers, and receive marks upon completion.",
      "Assignment creators can update or delete their own assignments.",
      "Users can view the status of their assignments, including pending and completed.",
    ],
    technologies: [
      "React",
      "Tailwind",
      "DaisyUI",
      "Firebase",
      "MongoDB",
      "Express.js",
      "Node.js",
    ],
  },
  {
    id: 3,
    slug: "techno-trend-store",
    title: "Techno Trend Store",
    subtitle: "An online platform to buy computers, mobiles, and tech products",
    image: "/projects/techno-trend-store.png",
    liveUrl: "https://your-live-link.com",
    clientUrl: "https://github.com/ashraful2430/your-client-repo",
    serverUrl: "https://github.com/ashraful2430/your-server-repo",
    description:
      "An e-commerce platform focused on technology products, offering a smooth browsing and shopping experience for customers.",
    features: [
      "Users can add products to cart and manage cart items easily.",
      "Users can update and delete products from the cart.",
      "Users can store products they like for future reference.",
      "Product information and purchase flow are accessible for authenticated users.",
    ],
    technologies: [
      "React",
      "Tailwind",
      "DaisyUI",
      "Firebase",
      "MongoDB",
      "Express.js",
      "Node.js",
    ],
  },
];

export const liveProducts = [
  {
    id: 1,
    name: "skillBNK",
    url: "https://www.skillbnk.com/",
    category: "Learning & Training Platform",
    role: "DevOps Engineer",
    summary:
      "Worked on the deployment, infrastructure support, release process, and operational reliability of skillBNK, a live production learning and training platform.",
    responsibilities: [
      "Supported application deployment and release management for live production environments.",
      "Worked on infrastructure and environment setup to ensure smooth and stable delivery.",
      "Helped maintain deployment workflows and improve release consistency.",
      "Supported cloud infrastructure operations and container-based deployment practices.",
      "Worked with Linux servers, Nginx, and environment-level configuration for stable hosting.",
      "Contributed to monitoring, troubleshooting, and platform reliability improvements.",
    ],
    achievements: [
      "Improved deployment consistency across environments.",
      "Reduced manual operational effort through better deployment practices.",
      "Helped strengthen system stability and production support workflows.",
    ],
    technologies: [
      "AWS",
      "Docker",
      "Kubernetes",
      "Terraform",
      "Ansible",
      "Nginx",
      "Linux",
      "CI/CD",
      "Prometheus",
      "Grafana",
    ],
  },
  {
    id: 2,
    name: "BizComs",
    url: "https://www.bizcoms.ai/",
    category: "AI Business Communication Platform",
    role: "DevOps Engineer",
    summary:
      "Contributed to deployment operations, infrastructure support, environment management, and release workflows for BizComs, a live AI-powered business communication platform.",
    responsibilities: [
      "Supported deployment and release processes for production environments.",
      "Worked on infrastructure setup and application hosting configuration.",
      "Assisted with deployment automation and environment reliability improvements.",
      "Supported cloud services, server maintenance, and operational troubleshooting.",
      "Helped improve release efficiency and deployment confidence.",
    ],
    achievements: [
      "Helped maintain smoother production release workflows.",
      "Improved operational consistency through better deployment practices.",
      "Supported reliable hosting and environment stability for a live AI platform.",
    ],
    technologies: [
      "AWS",
      "Docker",
      "Kubernetes",
      "Terraform",
      "Ansible",
      "Linux",
      "Nginx",
      "CI/CD",
    ],
  },
  {
    id: 3,
    name: "QuickSkill",
    url: "https://www.quickskill.ai/",
    category: "AI Learning Platform",
    role: "DevOps Engineer",
    summary:
      "Worked on deployment support, infrastructure operations, and production environment reliability for QuickSkill, a live AI-based learning platform.",
    responsibilities: [
      "Supported production deployment and release activities.",
      "Worked on environment provisioning, server configuration, and stable hosting setup.",
      "Helped maintain container-based deployment workflows and infrastructure support processes.",
      "Assisted with operational issue resolution, monitoring, and debugging.",
      "Contributed to improving platform availability and smoother release cycles.",
    ],
    achievements: [
      "Helped improve release stability for live production updates.",
      "Supported better platform uptime and operational reliability.",
      "Contributed to smoother infrastructure and deployment processes.",
    ],
    technologies: [
      "AWS",
      "Docker",
      "Kubernetes",
      "Terraform",
      "Ansible",
      "Linux",
      "Nginx",
      "CI/CD",
      "Monitoring",
    ],
  },
];

export const experience = {
  company: "SDB IT",
  role: "DevOps Engineer",
  period: "February 2024 - April 30, 2026",
  quote:
    "DevOps Engineer experienced in building scalable cloud infrastructure, automating delivery pipelines, and improving reliability through modern DevOps practices.",
  summary: [
    "Worked as a DevOps Engineer at SDB IT from February 2024 to April 30, 2026, focusing on designing, deploying, and maintaining cloud-native applications and infrastructure.",
    "Built and managed containerized environments using Docker and Kubernetes to improve deployment reliability, scalability, and operational consistency.",
    "Designed and optimized CI/CD pipelines using GitLab CI/CD, Jenkins, and GitOps workflows to automate build, test, deployment, and rollback processes.",
    "Provisioned and maintained infrastructure using Terraform and Ansible, reducing manual configuration and strengthening infrastructure-as-code practices.",
    "Configured and managed AWS services including EC2, VPC, IAM, S3, RDS, Load Balancers, and Auto Scaling to support secure and highly available workloads.",
    "Implemented monitoring and observability solutions using Prometheus and Grafana, improving alerting, troubleshooting, and system visibility.",
    "Worked extensively with Linux and Nginx for server administration, reverse proxy setup, application delivery, and performance optimization.",
    "Collaborated closely with development teams to streamline releases, improve deployment confidence, and strengthen platform reliability and security.",
  ],
};

export const education = [
  {
    id: 1,
    institution: "Bangladesh Railway High School",
    degree: "Secondary School Certificate",
    period: "2017 - 2018",
    location: "Khulna, Bangladesh",
    icon: GraduationCap,
  },
  {
    id: 2,
    institution: "Chattogram Polytechnic Institute",
    degree: "Computer Engineering",
    period: "2020 - Present",
    location: "Chattogram, Bangladesh",
    icon: GraduationCap,
  },
];

export const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Live Products", href: "#live-products" },
  { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
  { name: "Contact", href: "#contact" },
];