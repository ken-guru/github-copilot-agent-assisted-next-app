import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Activity } from '@mr-timely/types';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing, BorderRadius } from '../theme/colors';

interface ActivityCardProps {
  activity: Activity;
  onStart?: () => void;
  onStop?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onStart,
  onStop,
  onDelete,
  showActions = true,
}) => {
  const { colors } = useTheme();
  const isRunning = activity.state === 'RUNNING';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderLeftColor: activity.colors.primary,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{activity.name}</Text>
          {isRunning && (
            <View style={[styles.badge, { backgroundColor: colors.success }]}>
              <Text style={styles.badgeText}>Running</Text>
            </View>
          )}
        </View>
      </View>

      {activity.description && (
        <Text style={[styles.description, { color: colors.text }]} numberOfLines={2}>
          {activity.description}
        </Text>
      )}

      {showActions && (
        <View style={styles.actions}>
          {!isRunning && onStart && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={onStart}
            >
              <Ionicons name="play" size={16} color="#fff" />
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
          )}
          {isRunning && onStop && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.warning }]}
              onPress={onStop}
            >
              <Ionicons name="stop" size={16} color="#fff" />
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={[styles.button, styles.deleteButton, { backgroundColor: colors.danger }]}
              onPress={onDelete}
            >
              <Ionicons name="trash-outline" size={16} color="#fff" />
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  header: {
    marginBottom: Spacing.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 14,
    marginBottom: Spacing.md,
    opacity: 0.8,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: 4,
    minHeight: 36,
  },
  deleteButton: {
    flex: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
