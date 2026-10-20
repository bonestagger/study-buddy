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
    hoverBorder: 'hover:border-blue-500',
    bgBadge: 'bg-blue-500/10 text-blue-500',
    accentColor: '#3b82f6',
  },
  {
    id: 'PHYS',
    label: 'Physics',
    fullName: 'Physics',
    icon: '⚡',
    hoverBorder: 'hover:border-sky-500',
    bgBadge: 'bg-sky-500/10 text-sky-500',
    accentColor: '#0ea5e9',
  },
  {
    id: 'CHEM',
    label: 'Chem',
    fullName: 'Chemistry',
    icon: '🧪',
    hoverBorder: 'hover:border-teal-500',
    bgBadge: 'bg-teal-500/10 text-teal-500',
    accentColor: '#14b8a6',
  },
  {
    id: 'BIO',
    label: 'Biology',
    fullName: 'Biology',
    icon: '🌿',
    hoverBorder: 'hover:border-emerald-500',
    bgBadge: 'bg-emerald-500/10 text-emerald-500',
    accentColor: '#10b981',
  },
  {
    id: 'HIST',
    label: 'History',
    fullName: 'History & Civics',
    icon: '🏛️',
    hoverBorder: 'hover:border-amber-500',
    bgBadge: 'bg-amber-500/10 text-amber-500',
    accentColor: '#f59e0b',
  },
  {
    id: 'GEOG',
    label: 'Geography',
    fullName: 'Geography',
    icon: '🌍',
    hoverBorder: 'hover:border-orange-500',
    bgBadge: 'bg-orange-500/10 text-orange-500',
    accentColor: '#f97316',
  },
  {
    id: 'ENG1',
    label: 'English I',
    fullName: 'English Language',
    icon: '✍️',
    hoverBorder: 'hover:border-indigo-500',
    bgBadge: 'bg-indigo-500/10 text-indigo-500',
    accentColor: '#6366f1',
  },
  {
    id: 'ENG2',
    label: 'English II',
    fullName: 'English Literature',
    icon: '📚',
    hoverBorder: 'hover:border-purple-500',
    bgBadge: 'bg-purple-500/10 text-purple-500',
    accentColor: '#a855f7',
  },
  {
    id: 'HINDI',
    label: 'Hindi',
    fullName: 'Hindi (2nd Lang)',
    icon: '📖',
    hoverBorder: 'hover:border-rose-500',
    bgBadge: 'bg-rose-500/10 text-rose-500',
    accentColor: '#f43f5e',
  },
  {
    id: 'COMP',
    label: 'Computers',
    fullName: 'Computer Studies',
    icon: '💻',
    hoverBorder: 'hover:border-cyan-500',
    bgBadge: 'bg-cyan-500/10 text-cyan-500',
    accentColor: '#06b6d4',
  },
  {
    id: 'MAR',
    label: 'Marathi',
    fullName: 'Marathi (मराठी)',
    icon: '🚩',
    hoverBorder: 'hover:border-orange-500',
    bgBadge: 'bg-orange-500/10 text-orange-500',
    accentColor: '#f97316',
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
    hoverBorder: 'hover:border-indigo-500',
    bgBadge: 'bg-indigo-500/10 text-indigo-500',
    accentColor: '#6366f1',
  };
}
