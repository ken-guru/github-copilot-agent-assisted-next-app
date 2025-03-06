'use client';

import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import styles from './DarkModeToggle.module.css';

export default function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="toggle-container">
      <label className={styles.label}>
        <span className={styles.icon}>
          {isDarkMode ? '🌙' : '☀️'}
        </span>
        <div className={styles.toggleContainer}>
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={toggleDarkMode}
            className={styles.toggleInput}
            aria-label="Toggle dark mode"
          />
          <span className={styles.toggleSlider}></span>
        </div>
        <span className={styles.iconText}>
          {isDarkMode ? 'Dark' : 'Light'}
        </span>
      </label>
    </div>
  );
}