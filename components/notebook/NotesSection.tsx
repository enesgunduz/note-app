import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CreditCard as Edit3, Plus } from 'lucide-react-native';
import NoteCard from './NoteCard';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: any;
  lastModified: any;
}

interface NotesSectionProps {
  notes: Note[];
  notebookId: string;
  onAddNote: () => void;
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void;
  onDeleteNote: (noteId: string) => void;
}

export default function NotesSection({
  notes,
        notebookId,
        onAddNote,
        onUpdateNote,
        onDeleteNote,
      }: NotesSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notes ({notes?.length || 0})</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAddNote}>
          <Plus size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {notes?.length === 0 ? (
        <View style={styles.emptyState}>
          <Edit3 size={48} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>No notes yet</Text>
          <Text style={styles.emptyDescription}>
            Add your first note to get started
          </Text>
        </View>
      ) : (
        notes?.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            notebookId={notebookId}
            onUpdate={onUpdateNote}
            onDelete={onDeleteNote}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  addButton: {
    backgroundColor: '#2563EB',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
});
