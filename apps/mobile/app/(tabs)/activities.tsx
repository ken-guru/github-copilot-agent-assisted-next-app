import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useActivities } from '../../src/hooks/useActivities';
import { ActivityCard } from '../../src/components/ActivityCard';
import { Button } from '../../src/components/Button';
import { TextInput } from '../../src/components/TextInput';
import { Spacing, Typography, BorderRadius } from '../../src/theme/colors';

export default function ActivitiesScreen() {
  const { colors } = useTheme();
  const { activities, loading, addActivity, startActivity, completeActivity, removeActivity } =
    useActivities();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    if (name.trim()) {
      addActivity(name.trim(), description.trim() || undefined);
      setName('');
      setDescription('');
      setModalVisible(false);
    }
  };

  const handleDelete = (id: string, activityName: string) => {
    Alert.alert('Delete Activity', `Are you sure you want to delete "${activityName}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => removeActivity(id),
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerContent}>
          <Text style={[styles.info, { color: colors.text }]}>Loading activities...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Activities</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle" size={32} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {activities.length === 0 ? (
        <View style={styles.centerContent}>
          <Ionicons name="list-outline" size={64} color={colors.border} />
          <Text style={[styles.emptyText, { color: colors.text }]}>No activities yet</Text>
          <Text style={[styles.emptySubtext, { color: colors.border }]}>
            Tap the + button to create your first activity
          </Text>
        </View>
      ) : (
        <FlatList
          data={activities}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ActivityCard
              activity={item}
              onStart={() => startActivity(item.id)}
              onStop={() => completeActivity(item.id)}
              onDelete={() => handleDelete(item.id, item.name)}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: colors.primary, fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>New Activity</Text>
            <View style={{ width: 60 }} />
          </View>
          <View style={styles.modalContent}>
            <TextInput
              label="Name"
              placeholder="Activity name"
              value={name}
              onChangeText={setName}
              autoFocus
            />
            <TextInput
              label="Description (optional)"
              placeholder="Add a description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
            <Button title="Add Activity" onPress={handleAdd} disabled={!name.trim()} size="large" />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    ...Typography.h1,
  },
  list: {
    padding: Spacing.lg,
    paddingTop: 0,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  info: {
    ...Typography.body,
  },
  emptyText: {
    ...Typography.h3,
    marginTop: Spacing.lg,
  },
  emptySubtext: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  modalTitle: {
    ...Typography.h2,
  },
  modalContent: {
    padding: Spacing.lg,
  },
});
