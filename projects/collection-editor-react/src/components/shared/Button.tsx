import React from 'react';
import { Spinner } from './Spinner';

interface ButtonProps {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'ghost',
  size = 'md',
  isLoading,
  disabled,
  onClick,
  children,
  className,
  type = 'button',
}) => (
  <button
    type={type}
    className={`sbx-btn-${variant} ${size === 'sm' ? 'sbx-btn-sm' : ''} ${className ?? ''}`}
    onClick={onClick}
    disabled={isLoading || disabled}
    aria-busy={isLoading ? true : undefined}
  >
    {isLoading ? <Spinner size={14} /> : null}
    {children}
  </button>
);
