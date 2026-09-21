export interface Project {
  id: string;
  title: string;
  category: 'all' | 'fullstack' | 'frontend' | 'backend' | 'game';
  description: string;
  tags: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  highlightText?: string;
}

export interface SkillItem {
  name: string;
  category: 'Languages' | 'Frontend' | 'Backend & DB' | 'Tools & DevOps';
  level: string;
  iconClass: string;
}

export interface EducationItem {
  year: string;
  degree: string;
  institution: string;
  grade: string;
  status: string;
  details: string[];
  iconClass: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
