/**
 * Loading Animation Demo Component
 * Demonstrates various Material 3 loading states and animations
 */

'use client';

import React from 'react';
import Button from '../components/Button';
import Material3Card from '../components/Card';
import { useLoadingAnimation } from '../hooks/useAnimations';

export const LoadingAnimationDemo: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingType, setLoadingType] = React.useState<'spinner' | 'pulse' | 'shimmer'>('spinner');
  
  // Demo loading states
  const [buttonLoading, setButtonLoading] = React.useState(false);
  const [cardLoading, setCardLoading] = React.useState(false);
  const [formLoading, setFormLoading] = React.useState(false);

  const handleAsyncAction = async (type: string) => {
    switch (type) {
      case 'button':
        setButtonLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setButtonLoading(false);
        break;
      case 'card':
        setCardLoading(true);
        await new Promise(resolve => setTimeout(resolve, 3000));
        setCardLoading(false);
        break;
      case 'form':
        setFormLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2500));
        setFormLoading(false);
        break;
    }
  };

  return (
    <div style={{ 
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      <h1 style={{ 
        fontSize: '2rem',
        fontWeight: 600,
        color: 'var(--m3-on-surface)',
        marginBottom: '1rem'
      }}>
        Material 3 Loading Animations
      </h1>

      {/* Button Loading States */}
      <Material3Card style={{ padding: '1.5rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem',
          fontWeight: 500,
          color: 'var(--m3-on-surface)',
          marginBottom: '1rem'
        }}>
          Button Loading States
        </h2>
        
        <div style={{ 
          display: 'flex',
          gap: '1rem',
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          <Button
            loading={buttonLoading}
            loadingType="spinner"
            onClick={() => handleAsyncAction('button')}
          >
            Spinner Loading
          </Button>
          
          <Button
            variant="outlined"
            loading={buttonLoading}
            loadingType="pulse"
            onClick={() => handleAsyncAction('button')}
          >
            Pulse Loading
          </Button>
          
          <Button
            variant="tonal"
            loading={buttonLoading}
            loadingType="shimmer"
            onClick={() => handleAsyncAction('button')}
          >
            Shimmer Loading
          </Button>
        </div>

        <div style={{ 
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <Button
            variant="text"
            size="small"
            loading={buttonLoading}
            onClick={() => handleAsyncAction('button')}
          >
            Small Button
          </Button>
          
          <Button
            variant="elevated"
            size="large"
            loading={buttonLoading}
            onClick={() => handleAsyncAction('button')}
          >
            Large Button
          </Button>
          
          <Button
            iconOnly
            loading={buttonLoading}
            startIcon="+"
            onClick={() => handleAsyncAction('button')}
          />
        </div>
      </Material3Card>

      {/* Card Loading States */}
      <Material3Card style={{ padding: '1.5rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem',
          fontWeight: 500,
          color: 'var(--m3-on-surface)',
          marginBottom: '1rem'
        }}>
          Card Loading States
        </h2>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          <LoadingCard 
            type="shimmer" 
            isLoading={cardLoading}
            onToggle={() => handleAsyncAction('card')}
          />
          <LoadingCard 
            type="pulse" 
            isLoading={cardLoading}
            onToggle={() => handleAsyncAction('card')}
          />
          <LoadingCard 
            type="spinner" 
            isLoading={cardLoading}
            onToggle={() => handleAsyncAction('card')}
          />
        </div>
      </Material3Card>

      {/* Form Loading States */}
      <Material3Card style={{ padding: '1.5rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem',
          fontWeight: 500,
          color: 'var(--m3-on-surface)',
          marginBottom: '1rem'
        }}>
          Form Loading States
        </h2>
        
        <LoadingForm 
          isLoading={formLoading}
          onSubmit={() => handleAsyncAction('form')}
        />
      </Material3Card>

      {/* Performance Test */}
      <Material3Card style={{ padding: '1.5rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem',
          fontWeight: 500,
          color: 'var(--m3-on-surface)',
          marginBottom: '1rem'
        }}>
          Performance Test
        </h2>
        
        <p style={{ 
          color: 'var(--m3-on-surface-variant)',
          marginBottom: '1rem'
        }}>
          Test multiple simultaneous loading animations
        </p>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '0.5rem'
        }}>
          {Array.from({ length: 12 }).map((_, index) => (
            <Button
              key={index}
              size="small"
              variant={index % 4 === 0 ? 'filled' : index % 4 === 1 ? 'outlined' : index % 4 === 2 ? 'tonal' : 'text'}
              loading={isLoading}
              loadingType={index % 3 === 0 ? 'spinner' : index % 3 === 1 ? 'pulse' : 'shimmer'}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 2000);
              }}
            >
              Button {index + 1}
            </Button>
          ))}
        </div>
      </Material3Card>
    </div>
  );
};

// Supporting components

const LoadingCard: React.FC<{
  type: 'spinner' | 'pulse' | 'shimmer';
  isLoading: boolean;
  onToggle: () => void;
}> = ({ type, isLoading, onToggle }) => {
  const loadingRef = useLoadingAnimation(type);
  const [stopLoading, setStopLoading] = React.useState<(() => void) | null>(null);

  React.useEffect(() => {
    if (isLoading && loadingRef.ref.current) {
      const stop = loadingRef.startLoading();
      setStopLoading(() => stop);
    } else if (!isLoading && stopLoading) {
      stopLoading();
      setStopLoading(null);
    }
  }, [isLoading, loadingRef, stopLoading]);

  const combinedRef = React.useCallback((node: HTMLDivElement | null) => {
    if (loadingRef.ref.current !== node) {
      (loadingRef.ref as React.MutableRefObject<HTMLElement | null>).current = node;
    }
  }, [loadingRef.ref]);

  return (
    <Material3Card 
      ref={combinedRef}
      style={{ 
        padding: '1rem',
        minHeight: '150px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div>
        <h3 style={{ 
          fontSize: '1.2rem',
          fontWeight: 500,
          color: 'var(--m3-on-surface)',
          marginBottom: '0.5rem'
        }}>
          {type.charAt(0).toUpperCase() + type.slice(1)} Loading
        </h3>
        <p style={{ 
          color: 'var(--m3-on-surface-variant)',
          fontSize: '0.9rem'
        }}>
          Demonstrating {type} animation pattern for card content loading.
        </p>
      </div>
      
      <Button
        variant="text"
        size="small"
        onClick={onToggle}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Start Loading'}
      </Button>
    </Material3Card>
  );
};

const LoadingForm: React.FC<{
  isLoading: boolean;
  onSubmit: () => void;
}> = ({ isLoading, onSubmit }) => {
  return (
    <form 
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '400px'
      }}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div>
        <label style={{ 
          display: 'block',
          marginBottom: '0.5rem',
          color: 'var(--m3-on-surface)',
          fontSize: '0.9rem'
        }}>
          Name
        </label>
        <input
          type="text"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--m3-outline)',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            backgroundColor: isLoading ? 'var(--m3-surface-variant)' : 'var(--m3-surface)',
            color: 'var(--m3-on-surface)',
            opacity: isLoading ? 0.6 : 1,
            transition: 'all 200ms ease'
          }}
          placeholder="Enter your name"
        />
      </div>
      
      <div>
        <label style={{ 
          display: 'block',
          marginBottom: '0.5rem',
          color: 'var(--m3-on-surface)',
          fontSize: '0.9rem'
        }}>
          Email
        </label>
        <input
          type="email"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--m3-outline)',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            backgroundColor: isLoading ? 'var(--m3-surface-variant)' : 'var(--m3-surface)',
            color: 'var(--m3-on-surface)',
            opacity: isLoading ? 0.6 : 1,
            transition: 'all 200ms ease'
          }}
          placeholder="Enter your email"
        />
      </div>
      
      <Button
        type="submit"
        loading={isLoading}
        loadingType="spinner"
        fullWidth
      >
        Submit Form
      </Button>
    </form>
  );
};

export default LoadingAnimationDemo;