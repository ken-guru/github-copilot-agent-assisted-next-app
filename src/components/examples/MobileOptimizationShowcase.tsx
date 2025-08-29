/**
 * Material 3 Expressive Mobile Optimization Showcase
 * 
 * Demonstrates mobile-optimized components and interactions
 * with touch feedback, responsive layouts, and device-aware behavior.
 */

import React, { useState } from 'react';
import { Material3MobileButton } from '../ui/Material3MobileButton';
import { Material3MobileTextField } from '../ui/Material3MobileTextField';
import {
  Material3MobileLayout,
  Material3MobileContainer,
  Material3MobileGrid,
  Material3MobileStack,
} from '../ui/Material3MobileLayout';
import { useMobileOptimizations } from '../../hooks/useMobileOptimizations';
import styles from './MobileOptimizationShowcase.module.css';

export const MobileOptimizationShowcase: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    isMobile,
    isTablet,
    isTouch,
    orientation,
    viewportSize,
    shouldEnableHover,
  } = useMobileOptimizations();

  const handleInputChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    alert('Form submitted successfully!');
  };

  const deviceInfo = {
    'Device Type': isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop',
    'Touch Support': isTouch ? 'Yes' : 'No',
    'Orientation': orientation,
    'Viewport Size': viewportSize,
    'Hover Support': shouldEnableHover() ? 'Yes' : 'No',
  };

  return (
    <Material3MobileLayout
      variant="page"
      spacing="comfortable"
      useSafeArea
      touchScroll
      header={
        <Material3MobileContainer>
          <h1 className={styles.title}>Mobile Optimization Showcase</h1>
          <p className={styles.subtitle}>
            Demonstrating Material 3 Expressive mobile optimizations
          </p>
        </Material3MobileContainer>
      }
    >
      <Material3MobileContainer size="large" centered>
        <Material3MobileStack direction="vertical" gap="large">
          {/* Device Information Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Device Information</h2>
            <Material3MobileGrid columns={{ xs: 1, sm: 2, md: 3 }} gap="medium">
              {Object.entries(deviceInfo).map(([key, value]) => (
                <div key={key} className={styles.infoItem}>
                  <span className={styles.infoLabel}>{key}:</span>
                  <span className={styles.infoValue}>{value}</span>
                </div>
              ))}
            </Material3MobileGrid>
          </div>

          {/* Touch-Optimized Buttons */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Touch-Optimized Buttons</h2>
            <Material3MobileStack
              direction={isMobile ? 'vertical' : 'horizontal'}
              gap="medium"
              align="center"
            >
              <Material3MobileButton
                variant="filled"
                size="large"
                startIcon="🚀"
                enableRipple
              >
                Primary Action
              </Material3MobileButton>
              
              <Material3MobileButton
                variant="outlined"
                size="medium"
                endIcon="📱"
                enableRipple
              >
                Secondary Action
              </Material3MobileButton>
              
              <Material3MobileButton
                variant="text"
                size="small"
                enableRipple
              >
                Text Button
              </Material3MobileButton>
              
              <Material3MobileButton
                variant="elevated"
                startIcon="⭐"
                enableRipple
              >
                Elevated
              </Material3MobileButton>
              
              <Material3MobileButton
                variant="tonal"
                endIcon="🎨"
                enableRipple
              >
                Tonal
              </Material3MobileButton>
            </Material3MobileStack>
          </div>

          {/* Mobile-Optimized Form */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Mobile-Optimized Form</h2>
            <Material3MobileStack direction="vertical" gap="medium">
              <Material3MobileTextField
                label="Full Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                startIcon="👤"
                touchOptimized
                helperText="Enter your full name"
              />
              
              <Material3MobileTextField
                label="Email Address"
                type="email"
                inputMode="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                startIcon="📧"
                touchOptimized
                helperText="We'll never share your email"
              />
              
              <Material3MobileTextField
                label="Phone Number"
                type="tel"
                inputMode="tel"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                startIcon="📞"
                touchOptimized
                helperText="Include country code"
              />
              
              <Material3MobileTextField
                label="Message"
                value={formData.message}
                onChange={handleInputChange('message')}
                startIcon="💬"
                touchOptimized
                helperText="Tell us how we can help"
              />
              
              <Material3MobileButton
                variant="filled"
                size="large"
                onClick={handleSubmit}
                loading={isSubmitting}
                enableRipple
                startIcon={isSubmitting ? undefined : "📤"}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Form'}
              </Material3MobileButton>
            </Material3MobileStack>
          </div>

          {/* Responsive Grid Layout */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Responsive Grid Layout</h2>
            <Material3MobileGrid
              columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
              gap="medium"
            >
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className={styles.gridItem}>
                  <div className={styles.gridItemIcon}>
                    {['🎯', '🚀', '⭐', '🎨', '📱', '💡', '🔥', '✨'][i]}
                  </div>
                  <h3 className={styles.gridItemTitle}>Item {i + 1}</h3>
                  <p className={styles.gridItemDescription}>
                    This is a responsive grid item that adapts to different screen sizes.
                  </p>
                </div>
              ))}
            </Material3MobileGrid>
          </div>

          {/* Touch Feedback Demo */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Touch Feedback Demo</h2>
            <p className={styles.description}>
              {isTouch
                ? 'Touch the buttons below to see ripple effects and touch feedback'
                : 'Hover and click the buttons below to see interaction feedback'}
            </p>
            <Material3MobileStack
              direction="horizontal"
              gap="medium"
              justify="center"
              wrap
            >
              {['🎵', '🎮', '🎪', '🎭', '🎨', '🎯'].map((emoji, i) => (
                <Material3MobileButton
                  key={i}
                  variant={['filled', 'outlined', 'elevated', 'tonal', 'text', 'filled'][i % 6] as any}
                  enableRipple
                  className={styles.touchDemoButton}
                >
                  {emoji}
                </Material3MobileButton>
              ))}
            </Material3MobileStack>
          </div>

          {/* Orientation-Aware Layout */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Orientation-Aware Layout</h2>
            <p className={styles.description}>
              Current orientation: <strong>{orientation}</strong>
            </p>
            <Material3MobileStack
              direction={orientation === 'portrait' ? 'vertical' : 'horizontal'}
              gap="medium"
              align="center"
            >
              <div className={styles.orientationDemo}>
                <span className={styles.orientationIcon}>
                  {orientation === 'portrait' ? '📱' : '💻'}
                </span>
                <span>Portrait Mode</span>
              </div>
              <div className={styles.orientationDemo}>
                <span className={styles.orientationIcon}>
                  {orientation === 'landscape' ? '💻' : '📱'}
                </span>
                <span>Landscape Mode</span>
              </div>
            </Material3MobileStack>
          </div>
        </Material3MobileStack>
      </Material3MobileContainer>
    </Material3MobileLayout>
  );
};