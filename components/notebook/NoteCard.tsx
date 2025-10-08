import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Pencil } from 'lucide-react-native';
import DrawingPad from './DrawingPad';
import type { FC } from 'react';

interface Note {
  id: string;
  title: string;
  content: string;
  drawing?: string;
  createdAt: any;
  lastModified: any;
}

interface NoteCardProps {
  note: Note;
  onUpdate: (noteId: string, updates: Partial<Note>) => void;
  onDelete: (noteId: string) => void;
  notebookId: string;
}

const NoteCard: FC<NoteCardProps> = ({ note, onUpdate, onDelete, notebookId }) => {
  const router = useRouter();
  const [localTitle, setLocalTitle] = useState(note.title);
  const [localContent, setLocalContent] = useState(note.content);
  const [localDrawing, setLocalDrawing] = useState(note.drawing || '');
  const titleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drawingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update local state when note prop changes (from external updates)
  useEffect(() => {
    setLocalTitle(note.title);
    setLocalContent(note.content);
  }, [note.id]);

  // Update localDrawing only when drawing changes
  useEffect(() => {
    setLocalDrawing(note.drawing || '');
  }, [note.drawing]);

  const handleTitleChange = (text: string) => {
    setLocalTitle(text);
    if (titleTimeoutRef.current) {
      clearTimeout(titleTimeoutRef.current);
    }
    titleTimeoutRef.current = setTimeout(() => {
      onUpdate(note.id, { title: text });
    }, 500);
  };

  const handleContentChange = (text: string) => {
    setLocalContent(text);
    if (contentTimeoutRef.current) {
      clearTimeout(contentTimeoutRef.current);
    }
    contentTimeoutRef.current = setTimeout(() => {
      onUpdate(note.id, { content: text });
    }, 500);
  };

  const handleDrawingChange = (drawing: string) => {
    setLocalDrawing(drawing);
    if (drawingTimeoutRef.current) {
      clearTimeout(drawingTimeoutRef.current);
    }
    drawingTimeoutRef.current = setTimeout(() => {
      onUpdate(note.id, { drawing });
    }, 500);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (titleTimeoutRef.current) {
        clearTimeout(titleTimeoutRef.current);
      }
      if (contentTimeoutRef.current) {
        clearTimeout(contentTimeoutRef.current);
      }
      if (drawingTimeoutRef.current) {
        clearTimeout(drawingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.9} onPress={() => router.push(`/notebook/note?notebookId=${notebookId}&noteId=${note.id}`)}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{localTitle || 'Note title'}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(note.id)}
        >
          <X size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>
      {/* Only title will be shown, content, drawing and timestamp hidden */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginRight: 12,
  },
  iconButton: {
    padding: 4,
    marginRight: 4,
  },
  deleteButton: {
    padding: 4,
  },
  content: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    minHeight: 80,
    marginBottom: 12,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  // modal styles removed
});

export default NoteCard;
