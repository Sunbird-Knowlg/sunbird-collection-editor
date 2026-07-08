import React from 'react';
import styles from './TabBar.module.scss';

const TABS = [
  { id: 'details', label: 'Details' },
  { id: 'audience', label: 'Audience & Curriculum' },
  { id: 'licensing', label: 'Licensing' },
] as const;

type TabId = typeof TABS[number]['id'];

interface TabBarProps {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
  errorTabs?: string[];
  visibleTabs?: TabId[];
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onChange, errorTabs = [], visibleTabs }) => {
  const tabs = visibleTabs ? TABS.filter(t => visibleTabs.includes(t.id)) : TABS;
  return (
    <div className={styles.tabBar} role="tablist" aria-label="Metadata sections">
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          className={[styles.tab, activeTab === tab.id ? styles.active : '', errorTabs.includes(tab.id) ? styles.error : ''].join(' ')}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
          {errorTabs.includes(tab.id) && <span className={styles.errorDot} aria-label="Has errors" />}
        </button>
      ))}
    </div>
  );
};
