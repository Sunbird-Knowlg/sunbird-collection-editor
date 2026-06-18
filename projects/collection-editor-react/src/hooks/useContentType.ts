import { CT_COLOR_MAP, CT_ICON_MAP } from '../types/content';
import type { INode } from '../types/editor';
import type { IContent } from '../types/content';

type ContentLike = Partial<INode> | Partial<IContent>;

function resolveKey(item: ContentLike): string {
  const str = [
    (item as IContent).mimeType ?? '',
    (item as IContent).primaryCategory ?? '',
    (item as INode).contentType ?? '',
  ]
    .join(' ')
    .toLowerCase();

  if (str.includes('video')) return 'video';
  if (str.includes('pdf') || str.includes('epub')) return 'pdf';
  if (str.includes('h5p')) return 'h5p';
  if (str.includes('scorm')) return 'scorm';
  if (str.includes('audio') || str.includes('mp3')) return 'audio';
  if (
    str.includes('quiz') ||
    str.includes('question') ||
    str.includes('ecml')
  )
    return 'quiz';
  return 'default';
}

export interface CtStyle {
  key: string;
  color: string;
  bgClass: string;
  badgeClass: string;
  tintClass: string;
  iconName: string;
  label: string;
}

export function getCtStyle(item: ContentLike): CtStyle {
  const key = resolveKey(item);
  return {
    key,
    color: CT_COLOR_MAP[key as keyof typeof CT_COLOR_MAP] ?? CT_COLOR_MAP.default,
    bgClass: `sbx-ct-sq--${key}`,
    badgeClass: `sbx-ct-badge--${key}`,
    tintClass: `sbx-ct-tint--${key}`,
    iconName: CT_ICON_MAP[key as keyof typeof CT_ICON_MAP] ?? CT_ICON_MAP.default,
    label: key.charAt(0).toUpperCase() + key.slice(1),
  };
}

export function useContentType() {
  return { getCtStyle };
}
