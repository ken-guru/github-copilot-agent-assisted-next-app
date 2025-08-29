"use client";

import React, { useState } from 'react';
import { Material3Button, Material3IconButton, Material3FAB } from '../ui/Material3Button';

/**
 * Material 3 Expressive Button Showcase Component
 * 
 * Demonstrates all button variants, states, and interactions
 * following Material 3 Expressive design principles
 */
export const Material3ButtonShowcase: React.FC = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const toggleLoading = (buttonId: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [buttonId]: !prev[buttonId]
    }));

    // Auto-reset loading state after 3 seconds
    setTimeout(() => {
      setLoadingStates(prev => ({
        ...prev,
        [buttonId]: false
      }));
    }, 3000);
  };

  // Sample icons
  const PlusIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );

  const HeartIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );

  const DownloadIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7,10 12,15 17,10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  );

  const EditIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  );

  const DeleteIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3,6 5,6 21,6"></polyline>
      <path d="19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );

  return (
    <div style={{ 
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'var(--md-sys-typescale-font-family-plain)'
    }}>
      <h1 style={{
        fontFamily: 'var(--md-sys-typescale-display-small-font-family)',
        fontSize: 'var(--md-sys-typescale-display-small-font-size)',
        fontWeight: 'var(--md-sys-typescale-display-small-font-weight)',
        lineHeight: 'var(--md-sys-typescale-display-small-line-height)',
        color: 'var(--md-sys-color-on-surface)',
        marginBottom: '2rem'
      }}>
        Material 3 Expressive Buttons
      </h1>

      {/* Button Variants Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontFamily: 'var(--md-sys-typescale-headline-medium-font-family)',
          fontSize: 'var(--md-sys-typescale-headline-medium-font-size)',
          fontWeight: 'var(--md-sys-typescale-headline-medium-font-weight)',
          color: 'var(--md-sys-color-on-surface)',
          marginBottom: '1.5rem'
        }}>
          Button Variants
        </h2>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Filled Buttons */}
          <div>
            <h3 style={{
              fontSize: 'var(--md-sys-typescale-title-medium-font-size)',
              fontWeight: 'var(--md-sys-typescale-title-medium-font-weight)',
              color: 'var(--md-sys-color-on-surface)',
              marginBottom: '1rem'
            }}>
              Filled
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Material3Button variant="filled" onClick={() => toggleLoading('filled-primary')}>
                Primary Action
              </Material3Button>
              <Material3Button 
                variant="filled" 
                colorRole="secondary"
                loading={loadingStates['filled-loading']}
                onClick={() => toggleLoading('filled-loading')}
              >
                {loadingStates['filled-loading'] ? 'Loading...' : 'Click to Load'}
              </Material3Button>
              <Material3Button variant="filled" disabled>
                Disabled
              </Material3Button>
            </div>
          </div>

          {/* Outlined Buttons */}
          <div>
            <h3 style={{
              fontSize: 'var(--md-sys-typescale-title-medium-font-size)',
              fontWeight: 'var(--md-sys-typescale-title-medium-font-weight)',
              color: 'var(--md-sys-color-on-surface)',
              marginBottom: '1rem'
            }}>
              Outlined
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Material3Button variant="outlined">
                Secondary Action
              </Material3Button>
              <Material3Button variant="outlined" colorRole="tertiary">
                Tertiary Action
              </Material3Button>
              <Material3Button variant="outlined" disabled>
                Disabled
              </Material3Button>
            </div>
          </div>

          {/* Text Buttons */}
          <div>
            <h3 style={{
              fontSize: 'var(--md-sys-typescale-title-medium-font-size)',
              fontWeight: 'var(--md-sys-typescale-title-medium-font-weight)',
              color: 'var(--md-sys-color-on-surface)',
              marginBottom: '1rem'
            }}>
              Text
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Material3Button variant="text">
                Text Action
              </Material3Button>
              <Material3Button variant="text" colorRole="error">
                Delete
              </Material3Button>
              <Material3Button variant="text" disabled>
                Disabled
              </Material3Button>
            </div>
          </div>

          {/* Elevated Buttons */}
          <div>
            <h3 style={{
              fontSize: 'var(--md-sys-typescale-title-medium-font-size)',
              fontWeight: 'var(--md-sys-typescale-title-medium-font-weight)',
              color: 'var(--md-sys-color-on-surface)',
              marginBottom: '1rem'
            }}>
              Elevated
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Material3Button variant="elevated">
                Elevated Action
              </Material3Button>
              <Material3Button variant="elevated" colorRole="secondary">
                Secondary Elevated
              </Material3Button>
              <Material3Button variant="elevated" disabled>
                Disabled
              </Material3Button>
            </div>
          </div>

          {/* Tonal Buttons */}
          <div>
            <h3 style={{
              fontSize: 'var(--md-sys-typescale-title-medium-font-size)',
              fontWeight: 'var(--md-sys-typescale-title-medium-font-weight)',
              color: 'var(--md-sys-color-on-surface)',
              marginBottom: '1rem'
            }}>
              Tonal
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Material3Button variant="tonal">
                Tonal Action
              </Material3Button>
              <Material3Button variant="tonal" colorRole="tertiary">
                Tertiary Tonal
              </Material3Button>
              <Material3Button variant="tonal" disabled>
                Disabled
              </Material3Button>
            </div>
          </div>
        </div>
      </section>

      {/* Button Sizes Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontFamily: 'var(--md-sys-typescale-headline-medium-font-family)',
          fontSize: 'var(--md-sys-typescale-headline-medium-font-size)',
          fontWeight: 'var(--md-sys-typescale-headline-medium-font-weight)',
          color: 'var(--md-sys-color-on-surface)',
          marginBottom: '1.5rem'
        }}>
          Button Sizes
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Material3Button variant="filled" size="small">
            Small
          </Material3Button>
          <Material3Button variant="filled" size="medium">
            Medium
          </Material3Button>
          <Material3Button variant="filled" size="large">
            Large
          </Material3Button>
        </div>
      </section>

      {/* Buttons with Icons Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontFamily: 'var(--md-sys-typescale-headline-medium-font-family)',
          fontSize: 'var(--md-sys-typescale-headline-medium-font-size)',
          fontWeight: 'var(--md-sys-typescale-headline-medium-font-weight)',
          color: 'var(--md-sys-color-on-surface)',
          marginBottom: '1.5rem'
        }}>
          Buttons with Icons
        </h2>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <Material3Button variant="filled" startIcon={<PlusIcon />}>
            Add Item
          </Material3Button>
          <Material3Button variant="outlined" endIcon={<DownloadIcon />}>
            Download
          </Material3Button>
          <Material3Button variant="text" startIcon={<HeartIcon />}>
            Like
          </Material3Button>
          <Material3Button variant="elevated" startIcon={<EditIcon />} endIcon={<PlusIcon />}>
            Edit & Add
          </Material3Button>
        </div>
      </section>

      {/* Icon Buttons Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontFamily: 'var(--md-sys-typescale-headline-medium-font-family)',
          fontSize: 'var(--md-sys-typescale-headline-medium-font-size)',
          fontWeight: 'var(--md-sys-typescale-headline-medium-font-weight)',
          color: 'var(--md-sys-color-on-surface)',
          marginBottom: '1.5rem'
        }}>
          Icon Buttons
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Material3IconButton 
            icon={<HeartIcon />} 
            variant="filled"
            aria-label="Like"
          />
          <Material3IconButton 
            icon={<EditIcon />} 
            variant="outlined"
            aria-label="Edit"
          />
          <Material3IconButton 
            icon={<DeleteIcon />} 
            variant="text"
            colorRole="error"
            aria-label="Delete"
          />
          <Material3IconButton 
            icon={<DownloadIcon />} 
            variant="tonal"
            aria-label="Download"
          />
          <Material3IconButton 
            icon={<PlusIcon />} 
            variant="elevated"
            aria-label="Add"
          />
        </div>
      </section>

      {/* Floating Action Buttons Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontFamily: 'var(--md-sys-typescale-headline-medium-font-family)',
          fontSize: 'var(--md-sys-typescale-headline-medium-font-size)',
          fontWeight: 'var(--md-sys-typescale-headline-medium-font-weight)',
          color: 'var(--md-sys-color-on-surface)',
          marginBottom: '1.5rem'
        }}>
          Floating Action Buttons
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Material3FAB 
            icon={<PlusIcon />} 
            variant="small"
            aria-label="Add small"
          />
          <Material3FAB 
            icon={<PlusIcon />} 
            variant="large"
            aria-label="Add large"
          />
          <Material3FAB 
            icon={<EditIcon />} 
            variant="extended"
            label="Create"
            aria-label="Create new item"
          />
        </div>
      </section>

      {/* Full Width Buttons Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontFamily: 'var(--md-sys-typescale-headline-medium-font-family)',
          fontSize: 'var(--md-sys-typescale-headline-medium-font-size)',
          fontWeight: 'var(--md-sys-typescale-headline-medium-font-weight)',
          color: 'var(--md-sys-color-on-surface)',
          marginBottom: '1.5rem'
        }}>
          Full Width Buttons
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
          <Material3Button variant="filled" fullWidth>
            Full Width Filled
          </Material3Button>
          <Material3Button variant="outlined" fullWidth>
            Full Width Outlined
          </Material3Button>
          <Material3Button variant="tonal" fullWidth startIcon={<PlusIcon />}>
            Full Width with Icon
          </Material3Button>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section>
        <h2 style={{
          fontFamily: 'var(--md-sys-typescale-headline-medium-font-family)',
          fontSize: 'var(--md-sys-typescale-headline-medium-font-size)',
          fontWeight: 'var(--md-sys-typescale-headline-medium-font-weight)',
          color: 'var(--md-sys-color-on-surface)',
          marginBottom: '1.5rem'
        }}>
          Interactive Demo
        </h2>
        
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          flexWrap: 'wrap',
          padding: '1.5rem',
          backgroundColor: 'var(--md-sys-color-surface-container)',
          borderRadius: 'var(--md-sys-shape-corner-large)',
          border: '1px solid var(--md-sys-color-outline-variant)'
        }}>
          <Material3Button 
            variant="filled"
            loading={loadingStates['demo-save']}
            onClick={() => toggleLoading('demo-save')}
            startIcon={!loadingStates['demo-save'] ? <DownloadIcon /> : undefined}
          >
            {loadingStates['demo-save'] ? 'Saving...' : 'Save Changes'}
          </Material3Button>
          
          <Material3Button 
            variant="outlined"
            onClick={() => alert('Cancel clicked!')}
          >
            Cancel
          </Material3Button>
          
          <Material3Button 
            variant="text"
            colorRole="error"
            onClick={() => alert('Delete clicked!')}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Material3Button>
        </div>
      </section>
    </div>
  );
};