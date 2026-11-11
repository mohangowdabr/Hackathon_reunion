import { CategoryInfo } from '@/types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'hackathon',
    name: 'Hackathons',
    description: 'Build innovative projects in time-bound competitions with teams of developers, designers, and creators.',
    icon: 'Zap',
    color: '#3b82f6',
  },
  {
    id: 'coding-competition',
    name: 'Coding Competitions',
    description: 'Test your algorithmic problem-solving skills in competitive programming contests and coding challenges.',
    icon: 'Code2',
    color: '#8b5cf6',
  },
  {
    id: 'tech-conference',
    name: 'Tech Conferences',
    description: 'Attend industry-leading conferences to learn from experts, network with peers, and discover cutting-edge technologies.',
    icon: 'Mic2',
    color: '#06b6d4',
  },
  {
    id: 'webinar',
    name: 'Webinars',
    description: 'Join live online sessions featuring industry experts sharing insights on trending tech topics and best practices.',
    icon: 'Video',
    color: '#10b981',
  },
  {
    id: 'workshop',
    name: 'Workshops',
    description: 'Gain hands-on experience with guided, interactive sessions on specific technologies, tools, and methodologies.',
    icon: 'Wrench',
    color: '#f59e0b',
  },
  {
    id: 'bootcamp',
    name: 'Bootcamps',
    description: 'Accelerate your learning with intensive, structured programs designed to take you from beginner to job-ready.',
    icon: 'GraduationCap',
    color: '#ef4444',
  },
  {
    id: 'open-source',
    name: 'Open Source Programs',
    description: 'Contribute to real-world open-source projects, collaborate with global communities, and build your public portfolio.',
    icon: 'GitBranch',
    color: '#10b981',
  },
  {
    id: 'internship',
    name: 'Internships',
    description: 'Kick-start your career with hands-on industry experience at leading tech companies and innovative startups.',
    icon: 'Briefcase',
    color: '#3b82f6',
  },
  {
    id: 'fellowship',
    name: 'Fellowships',
    description: 'Join prestigious fellowship programs offering mentorship, funding, and unique opportunities for emerging technologists.',
    icon: 'Award',
    color: '#8b5cf6',
  },
  {
    id: 'research',
    name: 'Research Opportunities',
    description: 'Collaborate on cutting-edge research projects in AI, systems, security, and other frontiers of computer science.',
    icon: 'FlaskConical',
    color: '#06b6d4',
  },
  {
    id: 'startup-challenge',
    name: 'Startup Challenges',
    description: 'Pitch your startup idea, build an MVP, and compete for funding, mentorship, and incubation support.',
    icon: 'Rocket',
    color: '#f59e0b',
  },
  {
    id: 'ctf',
    name: 'CTF Competitions',
    description: 'Sharpen your cybersecurity skills by solving capture-the-flag challenges in cryptography, forensics, and exploitation.',
    icon: 'Shield',
    color: '#ef4444',
  },
  {
    id: 'design-challenge',
    name: 'Design Challenges',
    description: 'Showcase your creativity in UI/UX and product design competitions judged by industry professionals.',
    icon: 'Palette',
    color: '#ec4899',
  },
  {
    id: 'mentorship',
    name: 'Mentorship Programs',
    description: 'Get paired with experienced professionals who guide your growth through structured one-on-one mentoring.',
    icon: 'Users',
    color: '#8b5cf6',
  },
  {
    id: 'certification',
    name: 'Certification Challenges',
    description: 'Earn industry-recognized certifications through structured learning paths and skill-validation assessments.',
    icon: 'BadgeCheck',
    color: '#10b981',
  },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<string, CategoryInfo>;
