import React from 'react';
import styles from './FormSection.module.scss';

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, description, children }) => (
  <div className={styles.section}>
    <div className={styles.header}>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
    </div>
    <hr className={styles.divider} />
    <div className={styles.fields}>
      {children}
    </div>
  </div>
);
