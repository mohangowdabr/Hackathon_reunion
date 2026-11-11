export const SKILL_GROUPS: Record<string, string[]> = {
  'Languages': [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C', 'Rust', 'Go',
    'Ruby', 'Swift', 'Kotlin', 'PHP', 'Scala', 'R', 'Dart', 'Elixir',
  ],
  'Frontend': [
    'React', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'HTML/CSS',
    'Tailwind CSS', 'Bootstrap', 'Redux', 'Zustand', 'Framer Motion',
  ],
  'Backend': [
    'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'FastAPI',
    'Rails', 'ASP.NET', 'NestJS', 'Hono', 'tRPC',
  ],
  'Mobile': [
    'React Native', 'Flutter', 'Swift UI', 'Jetpack Compose', 'Ionic',
    'Expo', 'Capacitor',
  ],
  'Database': [
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Firebase', 'Supabase',
    'DynamoDB', 'SQLite', 'Prisma', 'Drizzle ORM',
  ],
  'Cloud & DevOps': [
    'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'CI/CD',
    'Terraform', 'Linux', 'Nginx', 'Vercel', 'Netlify', 'GitHub Actions',
  ],
  'AI & Data': [
    'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision',
    'TensorFlow', 'PyTorch', 'Data Science', 'Pandas', 'Scikit-learn',
    'LLMs', 'LangChain', 'Hugging Face', 'OpenAI API',
  ],
  'Security': [
    'Cybersecurity', 'Penetration Testing', 'Cryptography',
    'Network Security', 'OWASP', 'Reverse Engineering', 'Forensics',
  ],
  'Design': [
    'UI/UX Design', 'Figma', 'Adobe XD', 'Sketch', 'User Research',
    'Prototyping', 'Design Systems', 'Accessibility',
  ],
  'Other': [
    'Git', 'REST APIs', 'GraphQL', 'WebSockets', 'Blockchain', 'IoT',
    'AR/VR', 'Game Development', 'Web3', 'Solidity', 'Three.js',
    'WebAssembly', 'Agile', 'Technical Writing',
  ],
};

export const ALL_SKILLS: string[] = Object.values(SKILL_GROUPS).flat();
