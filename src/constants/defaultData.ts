import type { PortfolioData } from "@/types/portfolio";

export const STORAGE_KEY = "portfolio_data_v1";
export const AUTH_KEY = "portfolio_auth_v1";

export const DEFAULT_PORTFOLIO: PortfolioData = {
  name: "Ava Chen",
  title: "Design Student & Freelance Designer",
  tagline:
    "Junior at UCLA turning bold ideas into brands, interfaces and illustrations that clients love.",
  bio: "I'm a third-year Visual Communication student who freelances on the side. I help startups, small businesses and fellow creators ship polished brand identities and delightful digital products — on a student budget, with senior-level care.",
  location: "Los Angeles, CA",
  email: "hello@avachen.design",
  phone: "+1 (310) 555-0142",
  available: true,
  skills: [
    "Brand Identity",
    "UI/UX Design",
    "Figma",
    "Illustration",
    "Webflow",
    "Motion",
    "Typography",
    "Adobe Suite",
  ],
  services: [
    {
      id: "svc-1",
      title: "Brand Identity",
      description:
        "Logos, color systems and brand guidelines that make small businesses look established.",
    },
    {
      id: "svc-2",
      title: "UI/UX Design",
      description:
        "App and website interfaces designed in Figma, from wireframes to polished prototypes.",
    },
    {
      id: "svc-3",
      title: "Illustration",
      description:
        "Custom illustrations, icons and social graphics with a warm, editorial feel.",
    },
  ],
  projects: [
    {
      id: "prj-1",
      title: "Bloom Coffee Rebrand",
      category: "Branding",
      description:
        "A full identity refresh for a campus coffee shop — logo, packaging and menu system.",
      image:
        "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=900&h=700&fit=crop",
      link: "#",
    },
    {
      id: "prj-2",
      title: "Studyflow App",
      category: "UI/UX",
      description:
        "A focus-timer and planner app concept designed for busy students juggling deadlines.",
      image:
        "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=900&h=700&fit=crop",
      link: "#",
    },
    {
      id: "prj-3",
      title: "Nova Zine Series",
      category: "Illustration",
      description:
        "A hand-illustrated zine cover series exploring color, texture and student life.",
      image:
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900&h=700&fit=crop",
      link: "#",
    },
    {
      id: "prj-4",
      title: "Orbit Startup Site",
      category: "Web",
      description:
        "Landing page design and build for a student-founded SaaS startup at a hackathon.",
      image:
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=900&h=700&fit=crop",
      link: "#",
    },
  ],
  socials: [
    { id: "soc-1", label: "Dribbble", url: "https://dribbble.com" },
    { id: "soc-2", label: "Behance", url: "https://behance.net" },
    { id: "soc-3", label: "Instagram", url: "https://instagram.com" },
    { id: "soc-4", label: "LinkedIn", url: "https://linkedin.com" },
  ],
};
