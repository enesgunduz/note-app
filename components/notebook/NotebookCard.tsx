import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { BookOpen, Users, X } from 'lucide-react-native';

interface Notebook {
  id: string;
  title: string;
  description: string;
  sharedWith: string[];
  lastModified: any;
}

interface NotebookCardProps {
  notebook: Notebook;
  onPress: () => void;
  onDelete?: (id: string) => void;
}

export default function NotebookCard({ notebook, onPress, onDelete }: NotebookCardProps) {
  const handleDelete = (e: any) => {
    e.stopPropagation(); // Prevent card press
    
    if (!onDelete) return;
    
    Alert.alert(
      'Delete Notebook',
      'Are you sure you want to delete this notebook? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(notebook.id),
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <BookOpen size={20} color="#2563EB" />
          <Text style={styles.title}>{notebook.title}</Text>
        </View>
        {onDelete && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <X size={16} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.description}>{notebook.description}</Text>
      
      <View style={styles.footer}>
        <View style={styles.sharedIndicator}>
          <Users size={16} color="#64748B" />
          <Text style={styles.sharedText}>
            {notebook.sharedWith.length} shared
          </Text>
        </View>
        <Text style={styles.lastModified}>
          {notebook.lastModified?.toDate?.()?.toLocaleDateString() || 'Recently'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sharedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sharedText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  lastModified: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
});
