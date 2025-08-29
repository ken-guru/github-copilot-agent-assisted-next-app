import React, { useState } from 'react';
import { Material3TextField } from '../ui/Material3TextField';
import { Material3Button } from '../ui/Material3Button';
import { Material3FormGroup } from '../ui/Material3FormGroup';
import { Material3InputGroup } from '../ui/Material3InputGroup';
import ActivityFormMaterial3 from '../ActivityFormMaterial3';
import TimeSetupMaterial3 from '../TimeSetupMaterial3';
import styles from './Material3FormShowcase.module.css';

export const Material3FormShowcase: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    search: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      alert('Form submitted successfully!');
    }
  };

  const handleAddActivity = (activityName: string) => {
    alert(`Activity added: ${activityName}`);
  };

  const handleTimeSet = (durationInSeconds: number) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;
    alert(`Time set: ${hours}h ${minutes}m ${seconds}s`);
  };

  return (
    <div className={styles.showcase}>
      <div className={styles.header}>
        <h1 className={styles.title}>Material 3 Expressive Form Components</h1>
        <p className={styles.description}>
          Showcase of Material 3 Expressive form components with floating labels, 
          dynamic validation, and smooth animations.
        </p>
      </div>

      <div className={styles.sections}>
        {/* Basic Text Fields */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Text Fields</h2>
          <Material3FormGroup spacing="comfortable">
            <Material3TextField
              label="Full Name"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={!!errors.name}
              helperText={errors.name || 'Enter your full name'}
              required
            />
            
            <Material3TextField
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!errors.email}
              helperText={errors.email || 'We\'ll never share your email'}
              required
            />
            
            <Material3TextField
              label="Message"
              multiline
              rows={4}
              value={formData.message}
              onChange={handleInputChange('message')}
              error={!!errors.message}
              helperText={errors.message || 'Tell us what you think'}
              required
            />
          </Material3FormGroup>
        </section>

        {/* Input Groups */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Input Groups</h2>
          
          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Search Input (Attached)</h3>
            <Material3InputGroup variant="attached">
              <Material3TextField
                label="Search"
                value={formData.search}
                onChange={handleInputChange('search')}
                placeholder="Enter search terms..."
              />
              <Material3Button variant="filled">
                Search
              </Material3Button>
            </Material3InputGroup>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Email Verification (Spaced)</h3>
            <Material3InputGroup variant="spaced">
              <Material3TextField
                label="Email to Verify"
                type="email"
                placeholder="user@example.com"
              />
              <Material3Button variant="outlined">
                Verify
              </Material3Button>
            </Material3InputGroup>
          </div>
        </section>

        {/* Form Groups */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Form Groups</h2>
          
          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Row Layout</h3>
            <Material3FormGroup direction="row" spacing="comfortable">
              <Material3TextField
                label="First Name"
                placeholder="John"
              />
              <Material3TextField
                label="Last Name"
                placeholder="Doe"
              />
            </Material3FormGroup>
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Column Layout with Different Sizes</h3>
            <Material3FormGroup spacing="spacious">
              <Material3TextField
                label="Small Field"
                size="small"
                placeholder="Small size"
              />
              <Material3TextField
                label="Medium Field"
                size="medium"
                placeholder="Medium size (default)"
              />
              <Material3TextField
                label="Large Field"
                size="large"
                placeholder="Large size"
              />
            </Material3FormGroup>
          </div>
        </section>

        {/* Field States */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Field States</h2>
          <Material3FormGroup spacing="comfortable">
            <Material3TextField
              label="Normal Field"
              placeholder="This is a normal field"
            />
            
            <Material3TextField
              label="Disabled Field"
              value="Cannot edit this"
              disabled
              helperText="This field is disabled"
            />
            
            <Material3TextField
              label="Read Only Field"
              value="Read only content"
              readOnly
              helperText="This field is read-only"
            />
            
            <Material3TextField
              label="Error Field"
              value="Invalid input"
              error
              helperText="This field has an error"
            />
          </Material3FormGroup>
        </section>

        {/* Complex Components */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Complex Components</h2>
          
          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Activity Form</h3>
            <ActivityFormMaterial3
              onAddActivity={handleAddActivity}
              isDisabled={false}
            />
          </div>

          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>Time Setup</h3>
            <TimeSetupMaterial3 onTimeSet={handleTimeSet} />
          </div>
        </section>

        {/* Form Submission */}
        <section className={styles.section}>
          <form onSubmit={handleSubmit}>
            <Material3FormGroup spacing="comfortable">
              <Material3Button
                type="submit"
                variant="filled"
                size="large"
              >
                Submit Form
              </Material3Button>
            </Material3FormGroup>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Material3FormShowcase;