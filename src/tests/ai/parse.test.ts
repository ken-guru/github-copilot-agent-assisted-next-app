import { extractPlanFromText, validateAIActivities } from '@/utils/ai/parse';

describe('AI plan parsing', () => {
  it('parses valid JSON with activities', () => {
    const text = JSON.stringify({ activities: [
      { title: 'Study React', description: 'Hooks and effects', duration: 30 },
      { title: 'Break', description: 'Walk', duration: 5 }
    ]});
    const plan = extractPlanFromText(text);
    expect(plan.activities).toHaveLength(2);
    validateAIActivities(plan.activities);
  });

  it('defaults missing duration to 1', () => {
    const text = JSON.stringify({ activities: [
      { title: 'Quick task', description: 'No duration' }
    ]});
  const plan = extractPlanFromText(text);
  expect(plan.activities.length).toBeGreaterThan(0);
  expect(plan.activities[0]!.duration).toBe(1);
  });

  it('extracts JSON from fenced text', () => {
    const text = 'Here is your plan:\n```json\n{"activities":[{"title":"A","description":"B","duration":2}]}\n```';
  const plan = extractPlanFromText(text);
  expect(plan.activities.length).toBe(1);
  expect(plan.activities[0]!.title).toBe('A');
  });

  it('throws on empty activities', () => {
    expect(() => extractPlanFromText(JSON.stringify({ activities: [] }))).toThrow();
  });
});
