import React from 'react';
import styles from './Header.module.css';

export interface HeaderProps {
  onCreateTask: () => void;
}

/**
 * Header Component
 */
export const Header: React.FC<HeaderProps> = ({ onCreateTask }) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.branding}>
            <svg
              className={styles.logo}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <h1 className={styles.title}>Task Manager</h1>
          </div>
          <button className={styles.createButton} onClick={onCreateTask}>
            <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};


