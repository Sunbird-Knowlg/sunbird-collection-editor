import React from 'react';
import styles from './DropZone.module.scss';
import { useLabels } from '../../hooks/useLabels';

interface DropZoneProps {
  isActive: boolean;
  label?: string;
  nodeId?: string;
  className?: string;
}

export const DropZone: React.FC<DropZoneProps> = ({
  isActive,
  label,
  nodeId,
  className,
}) => {
  const lbl = useLabels();
  const resolvedLabel = label ?? lbl.dropZone.dropHere;
  return (
    <div
      className={`${styles.dropZone} ${isActive ? styles.active : ''} ${className ?? ''}`}
      data-droppable={isActive ? 'true' : undefined}
      data-node-id={nodeId}
      aria-label={resolvedLabel}
      role="region"
    >
      <span>{resolvedLabel}</span>
    </div>
  );
};
