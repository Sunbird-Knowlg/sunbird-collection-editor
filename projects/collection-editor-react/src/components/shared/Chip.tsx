import React from 'react';
import { useLabels } from '../../hooks/useLabels';

interface ChipProps {
  variant?: 'filled' | 'outline';
  active?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  variant = 'outline',
  active,
  onRemove,
  onClick,
  className,
  children,
}) => {
  const lbl = useLabels();
  return (
  <span
    className={`sbx-chip ${variant} ${active ? 'active' : ''} ${className ?? ''}`}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={
      onClick
        ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick();
            }
          }
        : undefined
    }
  >
    {children}
    {onRemove && (
      <button
        type="button"
        className="sbx-chip-remove"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        aria-label={lbl.chip.remove}
      >
        ×
      </button>
    )}
  </span>
  );
};
