import React from 'react';
import { useLabels } from '../../hooks/useLabels';
import styles from './TabBar.module.scss';

const TAB_IDS = ['details', 'audience', 'licensing'] as const;

type TabId = typeof TAB_IDS[number];

interface TabBarProps {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
  errorTabs?: string[];
  visibleTabs?: TabId[];
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onChange, errorTabs = [], visibleTabs }) => {
  const lbl = useLabels();
  const TABS = [
    { id: 'details' as const, label: lbl.tabBar.detailsTab },
    { id: 'audience' as const, label: lbl.tabBar.audienceCurriculumTab },
    { id: 'licensing' as const, label: lbl.tabBar.licensingTab },
  ];
  const tabs = visibleTabs ? TABS.filter(t => visibleTabs.includes(t.id)) : TABS;
  return (
    <div className={styles.tabBar} role="tablist" aria-label={lbl.tabBar.metadataSectionsAriaLabel}>
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
          {errorTabs.includes(tab.id) && <span className={styles.errorDot} aria-label={lbl.tabBar.hasErrorsAriaLabel} />}
        </button>
      ))}
    </div>
  );
};
