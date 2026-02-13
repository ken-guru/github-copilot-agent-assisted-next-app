import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useActivities } from '../../src/hooks/useActivities';
import { ActivityCard } from '../../src/components/ActivityCard';
import { Button } from '../../src/components/Button';
import { formatDuration } from '@mr-timely/shared';
import { Spacing, Typography } from '../../src/theme/colors';

export default function TimerScreen() {
  const { colors } = useTheme();
  const { currentActivity, completeActivity, activities } = useActivities();
  const [elapsedTime, setElapsedTime] = useState(0);

  // Update elapsed time for running activity
  useEffect(() => {
    if (!currentActivity || !currentActivity.startTime) {
      setElapsedTime(0);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Date.now() - (currentActivity.startTime || Date.now());
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentActivity]);

  const handleComplete = () => {
    if (currentActivity) {
      completeActivity(currentActivity.id);
    }
  };

  const pendingCount = activities.filter(a => a.state === 'PENDING').length;
  const completedCount = activities.filter(a => a.state === 'COMPLETED').length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Timer</Text>

        {currentActivity ? (
          <View style={styles.activeSection}>
            <View style={styles.timerDisplay}>
              <Text style={[styles.timerText, { color: colors.text }]}>
                {formatDuration(elapsedTime)}
              </Text>
              <Text style={[styles.timerLabel, { color: colors.border }]}>elapsed time</Text>
            </View>

            <ActivityCard
              activity={currentActivity}
              onStop={handleComplete}
              showActions={false}
            />

            <Button title="Complete Activity" onPress={handleComplete} variant="primary" size="large" />
          </View>
        ) : (
          <View style={styles.emptySection}>
            <Ionicons name="timer-outline" size={80} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Active Timer</Text>
            <Text style={[styles.emptySubtitle, { color: colors.border }]}>
              Go to Activities tab to start tracking
            </Text>
          </View>
        )}

        <View style={styles.statsSection}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{pendingCount}</Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>Pending</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.success }]}>{completedCount}</Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>Completed</Text>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            Using shared business logic from @mr-timely/shared package
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    marginBottom: Spacing.lg,
  },
  activeSection: {
    flex: 1,
    gap: Spacing.lg,
  },
  timerDisplay: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  timerLabel: {
    ...Typography.caption,
    textTransform: 'uppercase',
    marginTop: Spacing.sm,
  },
  emptySection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  emptyTitle: {
    ...Typography.h2,
  },
  emptySubtitle: {
    ...Typography.body,
    textAlign: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  statLabel: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
  infoCard: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  infoText: {
    ...Typography.caption,
    flex: 1,
  },
});
