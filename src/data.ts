import { Project, SkillItem, EducationItem } from './types';

export const PERSONAL_INFO = {
  name: 'Aryan Kumar',
  role: 'Full-Stack Developer',
  typewriterRoles: [
    'Full-Stack Developer 💻',
    'React & Node.js Engineer ⚡',
    'Diploma in CSE (2024-2027) 🎓',
    'Creative Web Architect 🚀',
  ],
  bio: 'Passionate about engineering scalable web applications, crafting intuitive user experiences, and continuously mastering modern technologies. Bridging elegant frontend interfaces with resilient backend architectures.',
  phone: '+91 8210820316',
  phoneDisplay: '+91 8210820316',
  email: 'aryankumarsfhh@gmail.com',
  whatsapp: '918210820316',
  location: 'Patna, Bihar & Ambedkar Nagar, U.P.',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  twitter: 'https://twitter.com',
  availableForWork: true,
  profileImage: '/my pic.jpg',
};

export const STATS = [
  { value: '10', suffix: '+', label: 'Projects Built' },
  { value: '4', suffix: '+', label: 'Core Languages' },
  { value: '82.6', suffix: '%', label: 'High School Score' },
  { value: '2027', suffix: '', label: 'CSE Diploma Class' },
];

export const EDUCATION_LIST: EducationItem[] = [
  {
    year: '2024 - 2027',
    degree: 'Diploma in Computer Science & Engineering (CSE)',
    institution: 'Chhatrapati Shahuji Maharaj Govt. Polytechnic College, Ambedkar Nagar, U.P.',
    grade: 'Currently Pursuing',
    status: 'In Progress (Active Student)',
    details: [
      'Core focus on Data Structures & Algorithms, Object-Oriented Programming, and Web Architectures.',
      'Practical software engineering labs, relational database schema design, and Linux systems administration.',
      'Active developer in student technology workshops and hands-on coding hackathons.',
    ],
    iconClass: 'fa-solid fa-graduation-cap',
  },
  {
    year: '2023',
    degree: 'High School Education (Matriculation)',
    institution: 'Himalayan Residential School (Andhra Chowk), Bikram, Patna, Bihar',
    grade: 'Score: 82.6%',
    status: 'Graduated with Distinction',
    details: [
      'Achieved First Division honors with exceptional performance in Mathematics and Science.',
      'Built strong analytical foundation leading to technical specialization in Computer Science.',
    ],
    iconClass: 'fa-solid fa-school',
  },
];

export const SKILLS: SkillItem[] = [
  { name: 'HTML5', category: 'Frontend', level: 'Advanced', iconClass: 'fa-brands fa-html5 text-orange-500' },
  { name: 'CSS3 / Tailwind', category: 'Frontend', level: 'Advanced', iconClass: 'fa-brands fa-css3-alt text-blue-500' },
  { name: 'JavaScript (ES6+)', category: 'Languages', level: 'Advanced', iconClass: 'fa-brands fa-js text-yellow-400' },
  { name: 'TypeScript', category: 'Languages', level: 'Proficient', iconClass: 'fa-solid fa-code text-blue-400' },
  { name: 'React', category: 'Frontend', level: 'Proficient', iconClass: 'fa-brands fa-react text-cyan-400' },
  { name: 'Node.js & Express', category: 'Backend & DB', level: 'Proficient', iconClass: 'fa-brands fa-node-js text-emerald-500' },
  { name: 'Python', category: 'Languages', level: 'Proficient', iconClass: 'fa-brands fa-python text-amber-300' },
  { name: 'PHP', category: 'Languages', level: 'Intermediate', iconClass: 'fa-brands fa-php text-indigo-400' },
  { name: 'SQL / PostgreSQL', category: 'Backend & DB', level: 'Proficient', iconClass: 'fa-solid fa-database text-sky-400' },
  { name: 'Git & GitHub', category: 'Tools & DevOps', level: 'Proficient', iconClass: 'fa-brands fa-git-alt text-orange-600' },
  { name: 'RESTful APIs', category: 'Backend & DB', level: 'Proficient', iconClass: 'fa-solid fa-network-wired text-rose-400' },
  { name: 'Responsive UI/UX', category: 'Frontend', level: 'Advanced', iconClass: 'fa-solid fa-mobile-screen-button text-purple-400' },
];

export const PROJECTS: Project[] = [
  {
    id: 'wuchang-gaming',
    title: 'Wuchang: Fallen Feathers Game Hub',
    category: 'game',
    description: 'An immersive interactive gaming showcase inspired by dark fantasy mythologies. Features cinematic visual assets, character lore databases, and interactive boss battle previews.',
    tags: ['React', 'JavaScript', 'CSS3 Animations', 'Audio FX'],
    image: '/pic2.png',
    liveUrl: '#',
    githubUrl: 'https://github.com',
    featured: true,
    highlightText: 'Showcase Project',
  },
  {
    id: 'ecommerce-platform',
    title: 'Full-Stack E-Commerce Platform',
    category: 'fullstack',
    description: 'A robust online marketplace system equipped with modular catalog browsing, reactive shopping cart management, coupon logic, and checkout state simulation.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1632&auto=format&fit=crop',
    liveUrl: '#',
    githubUrl: 'https://github.com',
    featured: true,
    highlightText: 'Full-Stack Web App',
  },
  {
    id: 'task-management-app',
    title: 'Productivity Task Management App',
    category: 'frontend',
    description: 'A responsive task workflow application with Kanban drag pipelines, priority categorization, deadline reminders, and persistent browser storage.',
    tags: ['JavaScript (ES6)', 'CSS3', 'REST API', 'Local Storage'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1528&auto=format&fit=crop',
    liveUrl: '#',
    githubUrl: 'https://github.com',
    featured: false,
    highlightText: 'Productivity Tool',
  },
  {
    id: 'analytics-dashboard',
    title: 'Enterprise Data Analytics Console',
    category: 'backend',
    description: 'A data visualizer console querying backend endpoints to produce real-time dynamic charts, telemetry statistics, user engagement graphs, and CSV report export tools.',
    tags: ['Python', 'PHP', 'Chart.js', 'SQL Database'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1615&auto=format&fit=crop',
    liveUrl: '#',
    githubUrl: 'https://github.com',
    featured: false,
    highlightText: 'Data & Dashboard',
  },
];
