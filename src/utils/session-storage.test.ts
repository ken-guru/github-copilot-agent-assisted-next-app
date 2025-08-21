import { saveSessionSnapshot, loadSessionSnapshot, clearSessionSnapshot, SESSION_STORAGE_KEY } from './session-storage';

// Keep a reference to the original localStorage to restore after tests
const originalLocalStorage = globalThis.localStorage;

describe('session-storage', () => {
  let store: Map<string, string>;
  beforeEach(() => {
    store = new Map<string, string>();
    const mockStorage: Storage = {
      get length() { return store.size; },
      clear: () => store.clear(),
      getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
      key: (index: number) => Array.from(store.keys())[index] ?? null,
      removeItem: (key: string) => { store.delete(key); },
      setItem: (key: string, value: string) => { store.set(key, value); }
    } as unknown as Storage;

    // Define localStorage on globalThis to avoid assigning to read-only property
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockStorage,
      configurable: true,
      writable: false
    });
  });

  afterEach(() => {
    // Restore the original localStorage after each test to avoid cross-test leakage
    Object.defineProperty(globalThis, 'localStorage', {
      value: originalLocalStorage,
      configurable: true,
      writable: false
    });
  });

  it('roundtrips a valid snapshot', () => {
    const snapshot = {
      timeSet: true,
      totalDuration: 3600,
      timerActive: true,
      currentActivityId: 'a1',
      timelineEntries: [
  { id: 'e1', activityId: 'a1', activityName: 'Task', startTime: 100, endTime: null, colors: { background: '#fff', text: '#000', border: '#00000033' } }
      ]
    };

    saveSessionSnapshot(snapshot);
    const loaded = loadSessionSnapshot();
    expect(loaded).toEqual(snapshot);
  });

  it('handles missing storage gracefully', () => {
    // Simulate missing localStorage by redefining it as undefined
    Object.defineProperty(globalThis, 'localStorage', {
      value: undefined,
      configurable: true
    });

    expect(loadSessionSnapshot()).toBeNull();
    expect(() =>
      saveSessionSnapshot({ timeSet: false, totalDuration: 0, timerActive: false, currentActivityId: null, timelineEntries: [] })
    ).not.toThrow();
  });

  it('clear removes the snapshot', () => {
    saveSessionSnapshot({ timeSet: true, totalDuration: 60, timerActive: false, currentActivityId: null, timelineEntries: []});
    expect(loadSessionSnapshot()).not.toBeNull();
    clearSessionSnapshot();
    expect(loadSessionSnapshot()).toBeNull();
  });

  it('ignores corrupted JSON', () => {
    localStorage.setItem(SESSION_STORAGE_KEY, '{ not json');
    expect(loadSessionSnapshot()).toBeNull();
  });

  it('sanitizes unexpected shapes', () => {
    // store something not matching expected shape
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ foo: 'bar', timeSet: 'yes' }));
    expect(loadSessionSnapshot()).toBeNull();
  });
});
