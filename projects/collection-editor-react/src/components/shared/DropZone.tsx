import React from 'react';
import styles from './DropZone.module.scss';

interface DropZoneProps {
  isActive: boolean;
  label?: string;
  nodeId?: string;
  className?: string;
}

export const DropZone: React.FC<DropZoneProps> = ({
  isActive,
  label = 'Drop here',
  nodeId,
  className,
}) => (
  <div
    className={`${styles.dropZone} ${isActive ? styles.active : ''} ${className ?? ''}`}
    data-droppable={isActive ? 'true' : undefined}
    data-node-id={nodeId}
    aria-label={label}
    role="region"
  >
    <span>{label}</span>
  </div>
);
