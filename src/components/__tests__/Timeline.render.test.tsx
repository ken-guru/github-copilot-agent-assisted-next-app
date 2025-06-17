import { render, screen } from '@testing-library/react';
import Timeline from '../Timeline';
import { TimelineEntry } from '@/types';
import { formatTimeHuman } from '@/utils/time';

// Mock react-bootstrap components
jest.mock('react-bootstrap/ListGroup', () => {
  const ListGroup = ({ children, ...props }: any) => <div {...props} role="list">{children}</div>;
  ListGroup.Item = ({ children, ...props }: any) => <div {...props} role="listitem" className="list-group-item">{children}</div>;
  return ListGroup;
});
// Corrected Badge mock to handle pill prop as string for data attribute
jest.mock('react-bootstrap/Badge', () => ({ children, bg, pill, className, ...props }: any) => (
  <span 
    {...props} 
    data-bg={bg} 
    data-pill={pill !== undefined ? String(pill) : undefined} // Ensure pill is string or undefined
    className={`badge ${bg ? `bg-${bg}` : ''} ${pill ? 'rounded-pill' : ''} ${className || ''}`.trim()}
  >
    {children}
  </span>
));
jest.mock('react-bootstrap/Container', () => ({ children, fluid, ...props }: any) => <div data-fluid={fluid ? String(fluid) : undefined} {...props}>{children}</div>);
jest.mock('react-bootstrap/Row', () => ({ children, ...props }: any) => <div {...props}>{children}</div>);
jest.mock('react-bootstrap/Col', () => ({ children, ...props }: any) => <div {...props}>{children}</div>);


describe('Timeline Component Rendering', () => {
  let dateNowSpy: jest.SpyInstance;
  
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  
  beforeEach(() => {
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1000000);
  });

  afterEach(() => {
    dateNowSpy.mockRestore();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should render the timeline with entries', () => {
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: 1000000,
        endTime: 1000000 + 1800000, // 30 minutes
      },
    ];
    render(
      <Timeline entries={mockEntries}
        totalDuration={3600} // 1 hour
        elapsedTime={1800} // 30 minutes
        timerActive={true}
      />
    );
    // Check for activity name
    const activityNameElement = screen.getByText('Task 1');
    expect(activityNameElement).toBeInTheDocument();

    // The Badge is a sibling of the activityNameElement, within the same flex container (div)
    // So, we go to the parent of activityNameElement (the div), then find the Badge within that div.
    const flexContainer = activityNameElement.parentElement;
    expect(flexContainer).not.toBeNull();

    // The Badge component is mocked as a <span> with class 'badge'
    // and its content is the formatted time.
    const durationBadge = flexContainer!.querySelector('span.badge');
    expect(durationBadge).toBeInTheDocument();
    expect(durationBadge).toHaveTextContent(formatTimeHuman(1800000));
  });
  
  it('should render an empty state when no entries are present', () => {
    render(
      <Timeline entries={[]}
        totalDuration={3600}
        elapsedTime={0}
        timerActive={false}
      />
    );
    expect(screen.getByText('No activities planned yet')).toBeInTheDocument();
  });

  it('should adjust timeline ruler and show overtime warning when activities run into overtime', () => {
    const startTime = 1000000 - 4000 * 1000; // Started 4000s ago
    const endTime = 1000000; // Ended now (relative to mock Date.now)
    const mockEntries: TimelineEntry[] = [
      {
        id: '1',
        activityId: 'activity-1',
        activityName: 'Task 1',
        startTime: startTime,
        endTime: endTime,
      }
    ];
    
    render(
      <Timeline entries={mockEntries}
        totalDuration={3600} // 1 hour total
        elapsedTime={4000} // 4000s elapsed (overtime)
        timerActive={true}
        isTimeUp={true} // Explicitly set time up
      />
    );
    
    // Check for overtime warning text. The component now includes total duration in the badge.
    const overtimeInMs = (4000 - 3600) * 1000;
    // The Timeline component will display: `Overtime: {formatted_overtime} / {formatted_total_duration}`
    const expectedHeaderText = `Overtime: ${formatTimeHuman(overtimeInMs)} / ${formatTimeHuman(3600 * 1000)}`;
    expect(screen.getByText(expectedHeaderText)).toBeInTheDocument();

    const activityItem = screen.getByText('Task 1');
    expect(activityItem).toBeInTheDocument();
    
    const flexContainer = activityItem.parentElement;
    expect(flexContainer).not.toBeNull();
    const durationBadge = flexContainer!.querySelector('span.badge');
    expect(durationBadge).toBeInTheDocument();
    // The activity duration itself is 4000s (1:06:40)
    expect(durationBadge).toHaveTextContent(formatTimeHuman(4000 * 1000)); 
  });
});