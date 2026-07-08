export interface IContent {
  identifier: string;
  name: string;
  description?: string;
  mimeType?: string;
  contentType?: string;
  primaryCategory?: string;
  appIcon?: string;
  channel?: string;
  organisation?: string[];
  framework?: string;
  status?: string;
  visibility?: string;
  pkgVersion?: number;
}

export interface ILibraryItem extends IContent {
  isSelected?: boolean;
  isDragging?: boolean;
}

export const CT_COLOR_MAP = {
  video: '#EA580C',
  pdf: '#DC2626',
  h5p: '#0D9488',
  scorm: '#7C3AED',
  audio: '#DB2777',
  quiz: '#16A34A',
  default: '#6B7280',
} as const satisfies Record<string, string>;

export const CT_ICON_MAP = {
  video: 'Video',
  pdf: 'FileText',
  h5p: 'Layers',
  scorm: 'Package',
  audio: 'Music',
  quiz: 'HelpCircle',
  default: 'File',
} as const satisfies Record<string, string>;

// Canonical primaryCategory values shown in the Library
export const LIBRARY_PRIMARY_CATEGORIES = [
  'Course Assessment',
  'eTextbook',
  'Exam Question',
  'Explanation Content',
  'Learning Resource',
  'Practice Question Set',
  'SCORM Content',
  'Teacher Resource',
] as const;

export type LibraryPrimaryCategory = typeof LIBRARY_PRIMARY_CATEGORIES[number];

export const CT_FILTERS: ReadonlyArray<{ label: string; value: string }> = [
  { label: 'All', value: 'all' },
  { label: 'Course Assessment', value: 'Course Assessment' },
  { label: 'eTextbook', value: 'eTextbook' },
  { label: 'Exam Question', value: 'Exam Question' },
  { label: 'Explanation Content', value: 'Explanation Content' },
  { label: 'Learning Resource', value: 'Learning Resource' },
  { label: 'Practice Question Set', value: 'Practice Question Set' },
  { label: 'SCORM Content', value: 'SCORM Content' },
  { label: 'Teacher Resource', value: 'Teacher Resource' },
];
