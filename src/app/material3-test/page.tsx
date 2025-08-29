'use client';

import React from 'react';
import Material3Button from '../../design-system/components/Button';
import Material3Card from '../../design-system/components/Card';
import Material3TextField from '../../design-system/components/TextField';

export default function Material3TestPage() {
  const [textValue, setTextValue] = React.useState('');
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    // Check initial dark mode state
    setDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div style={{ 
      padding: '2rem',
      minHeight: '100vh',
      backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
      color: darkMode ? '#ffffff' : '#000000',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 600, 
            marginBottom: '1rem',
            color: darkMode ? '#ffffff' : '#1a1a1a'
          }}>
            Material 3 Design System Test
          </h1>
          <p style={{ 
            fontSize: '1.125rem', 
            opacity: 0.8,
            marginBottom: '2rem'
          }}>
            Testing our Material 3 components with design tokens
          </p>
          
          <Material3Button 
            variant="outlined" 
            onClick={toggleDarkMode}
            data-testid="theme-toggle"
          >
            Toggle {darkMode ? 'Light' : 'Dark'} Mode
          </Material3Button>
        </div>

        {/* Button Showcase */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 600, 
            marginBottom: '1.5rem',
            color: darkMode ? '#ffffff' : '#1a1a1a'
          }}>
            Material 3 Buttons
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {/* Button variants */}
            <div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Variants</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Material3Button variant="filled" data-testid="button-filled">
                  Filled Button
                </Material3Button>
                <Material3Button variant="outlined" data-testid="button-outlined">
                  Outlined Button
                </Material3Button>
                <Material3Button variant="text" data-testid="button-text">
                  Text Button
                </Material3Button>
                <Material3Button variant="elevated" data-testid="button-elevated">
                  Elevated Button
                </Material3Button>
                <Material3Button variant="tonal" data-testid="button-tonal">
                  Tonal Button
                </Material3Button>
              </div>
            </div>

            {/* Button sizes */}
            <div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Sizes</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Material3Button size="small" data-testid="button-small">
                  Small Button
                </Material3Button>
                <Material3Button size="medium" data-testid="button-medium">
                  Medium Button
                </Material3Button>
                <Material3Button size="large" data-testid="button-large">
                  Large Button
                </Material3Button>
              </div>
            </div>

            {/* Button states */}
            <div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>States</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Material3Button loading data-testid="button-loading">
                  Loading Button
                </Material3Button>
                <Material3Button disabled data-testid="button-disabled">
                  Disabled Button
                </Material3Button>
                <Material3Button 
                  startIcon={<span>🚀</span>}
                  data-testid="button-with-icon"
                >
                  With Icon
                </Material3Button>
              </div>
            </div>
          </div>
        </section>

        {/* Card Showcase */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 600, 
            marginBottom: '1.5rem',
            color: darkMode ? '#ffffff' : '#1a1a1a'
          }}>
            Material 3 Cards
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <Material3Card 
              variant="elevated" 
              header="Elevated Card"
              data-testid="card-elevated"
            >
              <p>This is an elevated card with shadow and surface tint. Perfect for highlighting important content.</p>
            </Material3Card>

            <Material3Card 
              variant="filled" 
              header="Filled Card"
              data-testid="card-filled"
            >
              <p>This is a filled card with background color. Great for content that needs more visual weight.</p>
            </Material3Card>

            <Material3Card 
              variant="outlined" 
              header="Outlined Card"
              data-testid="card-outlined"
            >
              <p>This is an outlined card with border. Ideal for subtle content separation.</p>
            </Material3Card>

            <Material3Card 
              variant="elevated"
              interactive
              header="Interactive Card"
              actions={
                <Material3Button size="small" variant="text">
                  Action
                </Material3Button>
              }
              data-testid="card-interactive"
            >
              <p>This card is interactive - try hovering or clicking on it! It has ripple effects and state changes.</p>
            </Material3Card>
          </div>
        </section>

        {/* TextField Showcase */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 600, 
            marginBottom: '1.5rem',
            color: darkMode ? '#ffffff' : '#1a1a1a'
          }}>
            Material 3 Text Fields
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Filled Variant</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Material3TextField
                  variant="filled"
                  label="Name"
                  placeholder="Enter your name"
                  data-testid="textfield-filled"
                />
                <Material3TextField
                  variant="filled"
                  label="Email"
                  placeholder="Enter your email"
                  helperText="We'll never share your email"
                  required
                  data-testid="textfield-filled-helper"
                />
                <Material3TextField
                  variant="filled"
                  label="Error State"
                  validation="error"
                  errorText="This field has an error"
                  data-testid="textfield-filled-error"
                />
              </div>
            </div>

            <div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Outlined Variant</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Material3TextField
                  variant="outlined"
                  label="Description"
                  placeholder="Enter description"
                  data-testid="textfield-outlined"
                />
                <Material3TextField
                  variant="outlined"
                  label="Message"
                  multiline
                  rows={4}
                  placeholder="Enter your message"
                  data-testid="textfield-multiline"
                />
                <Material3TextField
                  variant="outlined"
                  label="Disabled Field"
                  disabled
                  value="This field is disabled"
                  data-testid="textfield-disabled"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Demo */}
        <section>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 600, 
            marginBottom: '1.5rem',
            color: darkMode ? '#ffffff' : '#1a1a1a'
          }}>
            Interactive Demo
          </h2>
          
          <Material3Card variant="outlined" padding="large">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <Material3TextField
                variant="filled"
                label="Interactive Input"
                value={textValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setTextValue(e.target.value)}
                helperText={`You've typed ${textValue.length} characters`}
                data-testid="interactive-input"
              />
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Material3Button 
                  variant="filled"
                  onClick={() => setTextValue('Hello Material 3!')}
                  data-testid="demo-button-fill"
                >
                  Fill Text
                </Material3Button>
                <Material3Button 
                  variant="outlined"
                  onClick={() => setTextValue('')}
                  data-testid="demo-button-clear"
                >
                  Clear Text
                </Material3Button>
                <Material3Button 
                  variant="text"
                  disabled={!textValue}
                  onClick={() => alert(`Text: ${textValue}`)}
                  data-testid="demo-button-show"
                >
                  Show Text
                </Material3Button>
              </div>
            </div>
          </Material3Card>
        </section>
      </div>
    </div>
  );
}