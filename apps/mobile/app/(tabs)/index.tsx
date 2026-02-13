import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Spacing, Typography } from '../../src/theme/colors';

export default function TimerScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Timer</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Mr. Timely - React Native
        </Text>
        <Text style={[styles.info, { color: colors.text }]}>
          Shared business logic from @mr-timely/shared package
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
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...Typography.h1,
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.h3,
    marginBottom: Spacing.lg,
  },
  info: {
    ...Typography.body,
    textAlign: 'center',
  },
});
