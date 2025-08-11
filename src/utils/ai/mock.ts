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

export function generateMockSummary(metrics: unknown): string {
  try {
    const getNum = (obj: unknown, key: string): number => {
      if (obj && typeof obj === 'object' && key in (obj as Record<string, unknown>)) {
        const v = (obj as Record<string, unknown>)[key];
        if (typeof v === 'number') return v;
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
      }
      return 0;
    };

    const planned = getNum(metrics, 'plannedTime');
    const spent = getNum(metrics, 'timeSpent');
    const overtime = getNum(metrics, 'overtime');
    const idle = getNum(metrics, 'idle');
    const done = (() => {
      if (metrics && typeof metrics === 'object' && 'perActivity' in (metrics as Record<string, unknown>)) {
        const v = (metrics as Record<string, unknown>)['perActivity'];
        return Array.isArray(v) ? v.length : 0;
      }
      return 0;
    })();
    return `Great session! You wrapped ${done} activities, spending ${spent} min (planned ${planned} min) with ${overtime} min overtime and ${idle} min idle. Keep the momentum going!`;
  } catch {
    return 'Great session! Productive time logged and actionable progress made. Keep the momentum going!';
  }
}
