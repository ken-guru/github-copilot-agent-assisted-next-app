/**
 * Material 3 Component Library Demo
 * Interactive showcase of all Material 3 components
 */

'use client';

import React from 'react';
import Material3Button from './Button';
import Material3Card from './Card';
import Material3Input from './Input';
import Material3Modal from './Modal';

export default function ComponentLibraryDemo() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  // Sample icons (using simple SVGs)
  const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
  );

  const PersonIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  );

  const ArrowForwardIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
    </svg>
  );

  const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  );

  return (
    <div className="component-library-demo p-8 space-y-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="demo-header text-center">
        <h1 className="m3-display-medium mb-4 text-on-surface">
          Material 3 Component Library
        </h1>
        <p className="m3-body-large text-on-surface-variant max-w-2xl mx-auto">
          A comprehensive collection of Material 3 components built with React and TypeScript, 
          following the Material 3 Expressive design principles.
        </p>
      </div>

      {/* Buttons Section */}
      <section className="buttons-section">
        <h2 className="m3-headline-medium mb-6 text-on-surface">Buttons</h2>
        
        <div className="space-y-8">
          {/* Button Variants */}
          <div className="variant-demo">
            <h3 className="m3-title-medium mb-4 text-on-surface">Variants</h3>
            <div className="flex flex-wrap gap-4">
              <Material3Button variant="filled">
                Filled
              </Material3Button>
              <Material3Button variant="outlined">
                Outlined
              </Material3Button>
              <Material3Button variant="text">
                Text
              </Material3Button>
              <Material3Button variant="elevated">
                Elevated
              </Material3Button>
              <Material3Button variant="tonal">
                Tonal
              </Material3Button>
            </div>
          </div>

          {/* Button Sizes */}
          <div className="size-demo">
            <h3 className="m3-title-medium mb-4 text-on-surface">Sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Material3Button size="small">Small</Material3Button>
              <Material3Button size="medium">Medium</Material3Button>
              <Material3Button size="large">Large</Material3Button>
            </div>
          </div>

          {/* Button States */}
          <div className="state-demo">
            <h3 className="m3-title-medium mb-4 text-on-surface">States</h3>
            <div className="flex flex-wrap gap-4">
              <Material3Button startIcon={<PersonIcon />}>
                With Start Icon
              </Material3Button>
              <Material3Button endIcon={<ArrowForwardIcon />}>
                With End Icon
              </Material3Button>
              <Material3Button loading={loading} onClick={handleLoadingDemo}>
                {loading ? 'Loading...' : 'Click for Loading'}
              </Material3Button>
              <Material3Button disabled>
                Disabled
              </Material3Button>
            </div>
          </div>

          {/* Full Width Button */}
          <div className="width-demo">
            <h3 className="m3-title-medium mb-4 text-on-surface">Full Width</h3>
            <Material3Button fullWidth variant="tonal">
              Full Width Button
            </Material3Button>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="cards-section">
        <h2 className="m3-headline-medium mb-6 text-on-surface">Cards</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Basic Card */}
          <Material3Card
            header="Basic Card"
            padding="medium"
          >
            <p className="m3-body-medium text-on-surface-variant">
              This is a basic card with header and content. Perfect for displaying 
              information in a contained format.
            </p>
          </Material3Card>

          {/* Elevated Card */}
          <Material3Card
            variant="elevated"
            header="Elevated Card"
            padding="medium"
            elevation={2}
          >
            <p className="m3-body-medium text-on-surface-variant">
              This elevated card has enhanced shadow and stands out from the surface.
            </p>
          </Material3Card>

          {/* Interactive Card */}
          <Material3Card
            variant="outlined"
            interactive
            padding="medium"
            onClick={() => alert('Card clicked!')}
          >
            <h3 className="m3-title-medium mb-2 text-on-surface">Interactive Card</h3>
            <p className="m3-body-medium text-on-surface-variant">
              Click me! This card responds to user interactions with hover and click effects.
            </p>
          </Material3Card>

          {/* Card with Actions */}
          <Material3Card
            variant="filled"
            header="Card with Actions"
            padding="medium"
            actions={
              <>
                <Material3Button variant="text" size="small">
                  Cancel
                </Material3Button>
                <Material3Button variant="filled" size="small">
                  Confirm
                </Material3Button>
              </>
            }
          >
            <p className="m3-body-medium text-on-surface-variant">
              This card includes action buttons in the footer area.
            </p>
          </Material3Card>

          {/* Card with Media */}
          <Material3Card
            variant="outlined"
            padding="none"
            media={
              <div className="h-32 bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <span className="text-on-primary m3-title-medium">Media Area</span>
              </div>
            }
          >
            <div className="p-4">
              <h3 className="m3-title-medium mb-2 text-on-surface">Card with Media</h3>
              <p className="m3-body-medium text-on-surface-variant">
                Cards can include media content like images or graphics.
              </p>
            </div>
          </Material3Card>

          {/* Complex Card */}
          <Material3Card
            variant="elevated"
            padding="none"
            header={
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <PersonIcon />
                </div>
                <div>
                  <h3 className="m3-title-medium text-on-surface">John Doe</h3>
                  <p className="m3-body-small text-on-surface-variant">2 hours ago</p>
                </div>
              </div>
            }
            actions={
              <>
                <Material3Button variant="text" size="small" startIcon={<SearchIcon />}>
                  View
                </Material3Button>
                <Material3Button variant="text" size="small">
                  Share
                </Material3Button>
              </>
            }
          >
            <div className="px-4 pb-2">
              <p className="m3-body-medium text-on-surface-variant">
                This is a complex card demonstrating custom header content with avatar, 
                timestamp, and multiple action buttons.
              </p>
            </div>
          </Material3Card>
        </div>
      </section>

      {/* Inputs Section */}
      <section className="inputs-section">
        <h2 className="m3-headline-medium mb-6 text-on-surface">Input Fields</h2>
        
        <div className="space-y-8">
          {/* Input Variants */}
          <div className="variant-demo">
            <h3 className="m3-title-medium mb-4 text-on-surface">Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Material3Input
                variant="outlined"
                label="Outlined Input"
                placeholder="Enter some text"
              />
              <Material3Input
                variant="filled"
                label="Filled Input"
                placeholder="Enter some text"
              />
            </div>
          </div>

          {/* Input Sizes */}
          <div className="size-demo">
            <h3 className="m3-title-medium mb-4 text-on-surface">Sizes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Material3Input
                size="small"
                label="Small Input"
                placeholder="Small size"
              />
              <Material3Input
                size="medium"
                label="Medium Input"
                placeholder="Medium size"
              />
              <Material3Input
                size="large"
                label="Large Input"
                placeholder="Large size"
              />
            </div>
          </div>

          {/* Input with Icons */}
          <div className="icon-demo">
            <h3 className="m3-title-medium mb-4 text-on-surface">With Icons</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Material3Input
                label="Search"
                placeholder="Search for something"
                leadingIcon={<SearchIcon />}
              />
              <Material3Input
                label="User Account"
                placeholder="Enter username"
                trailingIcon={<PersonIcon />}
              />
            </div>
          </div>

          {/* Input States */}
          <div className="state-demo">
            <h3 className="m3-title-medium mb-4 text-on-surface">States</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Material3Input
                label="Success State"
                value="Valid input"
                success
                helperText="This input is valid"
                readOnly
              />
              <Material3Input
                label="Error State"
                value="Invalid input"
                error
                errorText="This field is required"
                readOnly
              />
              <Material3Input
                label="Disabled Input"
                placeholder="Cannot edit this"
                disabled
              />
              <Material3Input
                label="With Helper Text"
                placeholder="Enter your email"
                helperText="We'll never share your email with anyone"
              />
            </div>
          </div>

          {/* Controlled Input */}
          <div className="controlled-demo">
            <h3 className="m3-title-medium mb-4 text-on-surface">Controlled Input</h3>
            <Material3Input
              fullWidth
              label="Controlled Input"
              placeholder="Type something..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              helperText={`Character count: ${inputValue.length}`}
            />
          </div>
        </div>
      </section>

      {/* Modal Section */}
      <section className="modal-section">
        <h2 className="m3-headline-medium mb-6 text-on-surface">Modals</h2>
        
        <div className="space-y-4">
          <Material3Button 
            variant="filled" 
            onClick={() => setModalOpen(true)}
          >
            Open Modal
          </Material3Button>

          <Material3Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Material 3 Modal"
            actions={
              <>
                <Material3Button 
                  variant="text" 
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Material3Button>
                <Material3Button 
                  variant="filled"
                  onClick={() => setModalOpen(false)}
                >
                  Confirm
                </Material3Button>
              </>
            }
          >
            <div className="space-y-4">
              <p className="m3-body-large text-on-surface">
                This is a Material 3 modal dialog demonstrating the complete modal experience 
                with proper focus management, accessibility, and smooth animations.
              </p>
              
              <p className="m3-body-medium text-on-surface-variant">
                Features include:
              </p>
              
              <ul className="list-disc list-inside space-y-1 text-on-surface-variant m3-body-medium">
                <li>Focus trapping and management</li>
                <li>Keyboard navigation (Tab, Shift+Tab, Escape)</li>
                <li>Backdrop click to close</li>
                <li>Smooth enter/exit animations</li>
                <li>Accessible ARIA attributes</li>
                <li>Body scroll lock</li>
              </ul>

              <Material3Input
                fullWidth
                label="Test Input in Modal"
                placeholder="Focus management works here too"
              />
            </div>
          </Material3Modal>
        </div>
      </section>

      {/* Design Principles */}
      <section className="principles-section">
        <h2 className="m3-headline-medium mb-6 text-on-surface">Design Principles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Material3Card padding="medium">
            <h3 className="m3-title-medium mb-2 text-primary">Accessible</h3>
            <p className="m3-body-medium text-on-surface-variant">
              All components follow WCAG guidelines with proper focus management, 
              ARIA labels, and keyboard navigation.
            </p>
          </Material3Card>

          <Material3Card padding="medium">
            <h3 className="m3-title-medium mb-2 text-secondary">Responsive</h3>
            <p className="m3-body-medium text-on-surface-variant">
              Components adapt to different screen sizes and respect user 
              preferences like reduced motion.
            </p>
          </Material3Card>

          <Material3Card padding="medium">
            <h3 className="m3-title-medium mb-2 text-tertiary">Type Safe</h3>
            <p className="m3-body-medium text-on-surface-variant">
              Built with TypeScript for excellent developer experience 
              and compile-time error catching.
            </p>
          </Material3Card>

          <Material3Card padding="medium">
            <h3 className="m3-title-medium mb-2 text-error">Customizable</h3>
            <p className="m3-body-medium text-on-surface-variant">
              Extensive props and CSS custom properties allow for 
              flexible theming and customization.
            </p>
          </Material3Card>
        </div>
      </section>
    </div>
  );
}