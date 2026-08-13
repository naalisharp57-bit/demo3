export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  link: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  available: boolean;
  skills: string[];
  services: Service[];
  projects: Project[];
  socials: SocialLink[];
}
