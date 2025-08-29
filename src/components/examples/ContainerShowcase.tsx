import React from 'react';
import { Material3Container } from '../ui/Material3Container';
import { Material3Card } from '../ui/Material3Card';
import { Material3StatsCard } from '../ui/Material3StatsCard';

export const ContainerShowcase: React.FC = () => {
  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <h1>Material 3 Expressive Container Components</h1>
      
      {/* Basic Container Examples */}
      <section>
        <h2>Basic Containers</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <Material3Container variant="elevated" padding="comfortable">
            <h3>Elevated Container</h3>
            <p>This is an elevated container with level 1 elevation and organic shape.</p>
          </Material3Container>
          
          <Material3Container variant="filled" colorRole="primary" padding="comfortable">
            <h3>Filled Container</h3>
            <p>This is a filled container with primary color role.</p>
          </Material3Container>
          
          <Material3Container variant="outlined" padding="comfortable">
            <h3>Outlined Container</h3>
            <p>This is an outlined container with border instead of elevation.</p>
          </Material3Container>
        </div>
      </section>

      {/* Shape Variations */}
      <section>
        <h2>Shape Variations</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Material3Container shape="small" padding="comfortable">
            <h4>Small Corners</h4>
            <p>Standard small corner radius</p>
          </Material3Container>
          
          <Material3Container shape="asymmetricMedium" padding="comfortable">
            <h4>Asymmetric</h4>
            <p>Organic asymmetric corners</p>
          </Material3Container>
          
          <Material3Container shape="activityCard" padding="comfortable">
            <h4>Activity Card</h4>
            <p>Component-specific shape</p>
          </Material3Container>
          
          <Material3Container shape="summaryCard" padding="comfortable">
            <h4>Summary Card</h4>
            <p>Summary-specific shape</p>
          </Material3Container>
        </div>
      </section>

      {/* Interactive States */}
      <section>
        <h2>Interactive States</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Material3Container interactive enableMotion padding="comfortable">
            <h4>Interactive</h4>
            <p>Hover me for elevation change</p>
          </Material3Container>
          
          <Material3Container focusable enableMotion padding="comfortable">
            <h4>Focusable</h4>
            <p>Tab to focus me</p>
          </Material3Container>
          
          <Material3Container contentState="active" padding="comfortable">
            <h4>Active State</h4>
            <p>Container in active state</p>
          </Material3Container>
          
          <Material3Container contentState="loading" padding="comfortable">
            <h4>Loading State</h4>
            <p>Container in loading state</p>
          </Material3Container>
        </div>
      </section>

      {/* Card Examples */}
      <section>
        <h2>Material 3 Cards</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          <Material3Card
            header={<h3>Card with Header</h3>}
            footer={<p>Card footer content</p>}
            actions={
              <>
                <button>Cancel</button>
                <button>Save</button>
              </>
            }
          >
            <p>This is the main content of the card. It demonstrates the header, body, and footer sections.</p>
          </Material3Card>
          
          <Material3Card
            variant="filled"
            header={<h3>Filled Card</h3>}
            padding="spacious"
          >
            <p>This is a filled card variant with spacious padding.</p>
          </Material3Card>
          
          <Material3Card
            variant="outlined"
            header={<h3>Outlined Card</h3>}
            interactive
            enableMotion
          >
            <p>This is an outlined card that's interactive. Hover to see the effect.</p>
          </Material3Card>
        </div>
      </section>

      {/* Stats Cards */}
      <section>
        <h2>Stats Cards</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Material3StatsCard
            label="Total Time"
            value="2h 45m"
            icon={<span>⏱️</span>}
            valueColor="primary"
          />
          
          <Material3StatsCard
            label="Completed Tasks"
            value={12}
            trend="up"
            secondaryValue="+3 from yesterday"
            valueColor="success"
          />
          
          <Material3StatsCard
            label="Active Sessions"
            value="3"
            trend="neutral"
            size="compact"
            valueColor="secondary"
          />
          
          <Material3StatsCard
            label="Efficiency"
            value="94%"
            trend="up"
            icon={<span>📈</span>}
            size="spacious"
            valueColor="success"
            interactive
          />
        </div>
      </section>

      {/* Content State Examples */}
      <section>
        <h2>Content States</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Material3Container contentState="default" padding="comfortable">
            <h4>Default State</h4>
            <p>Normal container state</p>
          </Material3Container>
          
          <Material3Container contentState="active" padding="comfortable">
            <h4>Active State</h4>
            <p>Container is active</p>
          </Material3Container>
          
          <Material3Container contentState="loading" padding="comfortable">
            <h4>Loading State</h4>
            <p>Container is loading</p>
          </Material3Container>
          
          <Material3Container contentState="error" padding="comfortable">
            <h4>Error State</h4>
            <p>Container has an error</p>
          </Material3Container>
          
          <Material3Container contentState="success" padding="comfortable">
            <h4>Success State</h4>
            <p>Container shows success</p>
          </Material3Container>
        </div>
      </section>

      {/* Color Role Examples */}
      <section>
        <h2>Color Roles</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Material3Container colorRole="surface" padding="comfortable">
            <h4>Surface</h4>
            <p>Surface color role</p>
          </Material3Container>
          
          <Material3Container colorRole="primary" variant="filled" padding="comfortable">
            <h4>Primary</h4>
            <p>Primary color role</p>
          </Material3Container>
          
          <Material3Container colorRole="secondary" variant="filled" padding="comfortable">
            <h4>Secondary</h4>
            <p>Secondary color role</p>
          </Material3Container>
          
          <Material3Container colorRole="tertiary" variant="filled" padding="comfortable">
            <h4>Tertiary</h4>
            <p>Tertiary color role</p>
          </Material3Container>
        </div>
      </section>

      {/* Responsive Examples */}
      <section>
        <h2>Responsive Behavior</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Material3Container responsive padding="comfortable">
            <h4>Responsive Container</h4>
            <p>This container adapts its padding and shape based on screen size. Resize the window to see the effect.</p>
          </Material3Container>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            <Material3StatsCard
              label="Mobile Optimized"
              value="100%"
              size="compact"
              responsive
            />
            <Material3StatsCard
              label="Tablet Ready"
              value="100%"
              size="comfortable"
              responsive
            />
            <Material3StatsCard
              label="Desktop Enhanced"
              value="100%"
              size="spacious"
              responsive
            />
          </div>
        </div>
      </section>
    </div>
  );
};