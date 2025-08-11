export type MockActivity = { title: string; description: string; duration: number };

export function generateMockPlan(userPrompt: string) {
  const base: MockActivity[] = [
    { title: 'Focus Session', description: 'Deep work on your main task', duration: 25 },
    { title: 'Short Break', description: 'Stretch and hydrate', duration: 5 },
    { title: 'Practice/Review', description: 'Reinforce key concepts from the session', duration: 15 },
  ];

  // Try to infer a topic from the prompt to personalize the titles slightly
  const topic = (userPrompt.match(/(react|typescript|javascript|design|writing|study|debugging)/i)?.[1] || '').toLowerCase();
  const withTopic = base.map((a, i) => ({
    ...a,
    title: topic && i !== 1 ? `${a.title} • ${topic}` : a.title,
  }));

  return { activities: withTopic };
}

export function generateMockSummary(metrics: any): string {
  try {
    const planned = Number(metrics?.plannedTime ?? 0);
    const spent = Number(metrics?.timeSpent ?? 0);
    const overtime = Number(metrics?.overtime ?? 0);
    const idle = Number(metrics?.idle ?? 0);
    const done = Array.isArray(metrics?.perActivity) ? metrics.perActivity.length : 0;
    return `Great session! You wrapped ${done} activities, spending ${spent} min (planned ${planned} min) with ${overtime} min overtime and ${idle} min idle. Keep the momentum going!`;
  } catch {
    return 'Great session! Productive time logged and actionable progress made. Keep the momentum going!';
  }
}
