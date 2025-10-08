import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { CreditCard as Edit3, Save, Users } from 'lucide-react-native';

interface NotebookHeaderProps {
  title: string;
  description: string;
  sharedWithCount: number;
  lastModified: string;
  onTitleUpdate: (title: string) => void;
  onDescriptionUpdate: (description: string) => void;
}

export default function NotebookHeader({
  title,
  description,
  sharedWithCount,
  lastModified,
  onTitleUpdate,
  onDescriptionUpdate,
}: NotebookHeaderProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const [tempDescription, setTempDescription] = useState(description);

  const saveTitle = () => {
    if (tempTitle.trim()) {
      onTitleUpdate(tempTitle.trim());
      setEditingTitle(false);
    }
  };

  const saveDescription = () => {
    onDescriptionUpdate(tempDescription.trim() || 'Tap to add description');
    setEditingDescription(false);
  };

  return (
    <View style={styles.container}>
      {editingTitle ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.titleInput}
            value={tempTitle}
            onChangeText={setTempTitle}
            onBlur={saveTitle}
            onSubmitEditing={saveTitle}
            autoFocus
            multiline
          />
          <TouchableOpacity style={styles.saveButton} onPress={saveTitle}>
            <Save size={20} color="#059669" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.titleContainer}
          onPress={() => {
            setTempTitle(title);
            setEditingTitle(true);
          }}
        >
          <Text style={styles.title}>{title}</Text>
          <Edit3 size={16} color="#64748B" />
        </TouchableOpacity>
      )}

      {editingDescription ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.descriptionInput}
            value={tempDescription}
            onChangeText={setTempDescription}
            onBlur={saveDescription}
            onSubmitEditing={saveDescription}
            autoFocus
            multiline
          />
          <TouchableOpacity style={styles.saveButton} onPress={saveDescription}>
            <Save size={20} color="#059669" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.descriptionContainer}
          onPress={() => {
            setTempDescription(description);
            setEditingDescription(true);
          }}
        >
          <Text style={styles.description}>{description}</Text>
          <Edit3 size={14} color="#64748B" />
        </TouchableOpacity>
      )}

      <View style={styles.meta}>
        <View style={styles.sharedInfo}>
          <Users size={16} color="#64748B" />
          <Text style={styles.sharedText}>
            Shared with {sharedWithCount} people
          </Text>
        </View>
        <Text style={styles.lastModified}>{lastModified}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  titleInput: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    flex: 1,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 16,
  },
  descriptionInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    minHeight: 60,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    flex: 1,
    lineHeight: 24,
  },
  saveButton: {
    padding: 8,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sharedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sharedText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  lastModified: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
});
