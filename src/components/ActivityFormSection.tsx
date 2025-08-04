import React, { useMemo } from 'react';
import { Alert } from 'react-bootstrap';
import { ColorSet } from '../utils/colors';
import ActivityForm from './feature/ActivityForm';
import OvertimeWarning from './OvertimeWarning';
import ClientOnly from './ClientOnly';
import { Activity as CanonicalActivity } from '../types/activity';

type Activity = CanonicalActivity & { colors?: ColorSet };

interface ActivityFormSectionProps {
  activities: Activity[];
  currentActivityId: string | null;
  isTimeUp: boolean;
  preservedFormValues: { name: string; description: string; } | null;
  onAddActivity: (activity: Activity) => void;
  onFormValuesChange: (values: { name: string; description: string; }) => void;
  showOvertimeWarning: boolean;
  timeOverage: number;
  isSimplified?: boolean; // Determines if the form should be simplified (timeline context)
}

/**
 * Memoized activity form section that is completely isolated from timer updates.
 * This component only re-renders when activity-related state changes, ensuring
 * form focus is preserved during timer progression.
 */
const ActivityFormSection = React.memo<ActivityFormSectionProps>(({
  activities,
  currentActivityId,
  isTimeUp,
  preservedFormValues,
  onAddActivity,
  onFormValuesChange,
  showOvertimeWarning,
  timeOverage,
  isSimplified = false
}) => {
  // Memoize the activity form to prevent unnecessary re-renders
  const MemoizedActivityForm = useMemo(() => (
    <ActivityForm
      existingActivities={activities}
      onAddActivity={onAddActivity}
      preservedValues={preservedFormValues || undefined}
      onFormValuesChange={onFormValuesChange}
      isDisabled={!!currentActivityId || isTimeUp}
      isSimplified={isSimplified}
    />
  ), [activities, onAddActivity, preservedFormValues, onFormValuesChange, currentActivityId, isTimeUp, isSimplified]);

  if (activities.length === 0) {
    return (
      <Alert variant="info" className="text-center flex-shrink-0" data-testid="empty-state">
        No activities defined
      </Alert>
    );
  }

  return (
    <div className="flex-shrink-0 mb-3" data-testid="activity-form-column">
      <ClientOnly fallback={<div style={{ height: '200px' }} />}>
        {showOvertimeWarning ? (
          <OvertimeWarning 
            timeOverage={timeOverage}
          />
        ) : (
          MemoizedActivityForm
        )}
      </ClientOnly>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - exclude timer-related props to prevent form re-renders
  return (
    prevProps.activities === nextProps.activities &&
    prevProps.currentActivityId === nextProps.currentActivityId &&
    prevProps.isTimeUp === nextProps.isTimeUp &&
    prevProps.preservedFormValues === nextProps.preservedFormValues &&
    prevProps.onAddActivity === nextProps.onAddActivity &&
    prevProps.onFormValuesChange === nextProps.onFormValuesChange &&
    prevProps.showOvertimeWarning === nextProps.showOvertimeWarning &&
    prevProps.timeOverage === nextProps.timeOverage &&
    prevProps.isSimplified === nextProps.isSimplified
  );
});

ActivityFormSection.displayName = 'ActivityFormSection';

export default ActivityFormSection;
