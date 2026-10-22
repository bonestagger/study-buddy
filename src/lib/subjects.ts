export interface SubjectInfo {
  id: string;
  label: string;
  fullName: string;
  icon: string;
  hoverBorder: string;
  bgBadge: string;
  accentColor: string;
}

export const SUBJECTS: SubjectInfo[] = [
  {
    id: 'MATH',
    label: 'Math',
    fullName: 'Mathematics',
    icon: '📐',
    hoverBorder: 'hover:border-blue-400',
    bgBadge: 'bg-blue-50 text-blue-700 border border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60',
    accentColor: '#2563eb',
  },
  {
    id: 'PHYS',
    label: 'Physics',
    fullName: 'Physics',
    icon: '⚡',
    hoverBorder: 'hover:border-sky-400',
    bgBadge: 'bg-sky-50 text-sky-700 border border-sky-200/80 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/60',
    accentColor: '#0284c7',
  },
  {
    id: 'CHEM',
    label: 'Chem',
    fullName: 'Chemistry',
    icon: '🧪',
    hoverBorder: 'hover:border-teal-400',
    bgBadge: 'bg-teal-50 text-teal-700 border border-teal-200/80 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/60',
    accentColor: '#0d9488',
  },
  {
    id: 'BIO',
    label: 'Biology',
    fullName: 'Biology',
    icon: '🌿',
    hoverBorder: 'hover:border-emerald-400',
    bgBadge: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60',
    accentColor: '#059669',
  },
  {
    id: 'HIST',
    label: 'History',
    fullName: 'History & Civics',
    icon: '🏛️',
    hoverBorder: 'hover:border-amber-400',
    bgBadge: 'bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60',
    accentColor: '#d97706',
  },
  {
    id: 'GEOG',
    label: 'Geography',
    fullName: 'Geography',
    icon: '🌍',
    hoverBorder: 'hover:border-orange-400',
    bgBadge: 'bg-orange-50 text-orange-700 border border-orange-200/80 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800/60',
    accentColor: '#ea580c',
  },
  {
    id: 'ENG1',
    label: 'English I',
    fullName: 'English Language',
    icon: '✍️',
    hoverBorder: 'hover:border-indigo-400',
    bgBadge: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/60',
    accentColor: '#4f46e5',
  },
  {
    id: 'ENG2',
    label: 'English II',
    fullName: 'English Literature',
    icon: '📚',
    hoverBorder: 'hover:border-purple-400',
    bgBadge: 'bg-purple-50 text-purple-700 border border-purple-200/80 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60',
    accentColor: '#9333ea',
  },
  {
    id: 'HINDI',
    label: 'Hindi',
    fullName: 'Hindi (2nd Lang)',
    icon: '📖',
    hoverBorder: 'hover:border-rose-400',
    bgBadge: 'bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60',
    accentColor: '#e11d48',
  },
  {
    id: 'COMP',
    label: 'Computers',
    fullName: 'Computer Studies',
    icon: '💻',
    hoverBorder: 'hover:border-cyan-400',
    bgBadge: 'bg-cyan-50 text-cyan-700 border border-cyan-200/80 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/60',
    accentColor: '#0891b2',
  },
  {
    id: 'MAR',
    label: 'Marathi',
    fullName: 'Marathi (मराठी)',
    icon: '🚩',
    hoverBorder: 'hover:border-violet-400',
    bgBadge: 'bg-violet-50 text-violet-700 border border-violet-200/80 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800/60',
    accentColor: '#7c3aed',
  },
];

export function getSubject(id: string): SubjectInfo {
  const found = SUBJECTS.find(
    (s) =>
      s.id === id ||
      s.label.toUpperCase() === id.toUpperCase() ||
      (id.toUpperCase() === 'MARATHI' && s.id === 'MAR')
  );
  if (found) return found;

  return {
    id,
    label: id,
    fullName: id,
    icon: '📄',
    hoverBorder: 'hover:border-blue-400',
    bgBadge: 'bg-blue-50 text-blue-700 border border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60',
    accentColor: '#2563eb',
  };
}
