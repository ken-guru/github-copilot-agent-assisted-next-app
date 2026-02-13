import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Spacing, Typography } from '../../src/theme/colors';

export default function ActivitiesScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Activities</Text>
        <Text style={[styles.info, { color: colors.text }]}>
          Activity management screen using shared state machine
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    marginBottom: Spacing.md,
  },
  info: {
    ...Typography.body,
  },
});
