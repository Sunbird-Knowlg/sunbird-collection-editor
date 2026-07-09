import React from 'react';
import styles from './Spinner.module.scss';
import { useLabels } from '../../hooks/useLabels';

interface SpinnerProps {
  size?: number;
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 16,
  color = 'currentColor',
}) => {
  const lbl = useLabels();
  return (
    <svg
      className={styles.spin}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-label={lbl.spinner.loading}
      role="status"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="3"
        strokeDasharray="31.4"
        strokeDashoffset="10"
        strokeLinecap="round"
      />
    </svg>
  );
};
