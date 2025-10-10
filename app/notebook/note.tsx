import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

// Not ve Notebook arayüzleri (components/notebook/NoteCard.tsx ve NotesSection.tsx'ten alınmıştır)
interface Note {
  id: string;
  title: string;
  content: string;
  drawing?: string;
  lastModified?: Date | string;
}

interface Notebook {
  id: string;
  title: string;
  notes: Note[];
  owner: string;
  sharedWith?: string[];
  createdAt?: Date | string;
}
const NoteDetailScreen = () => {
  const { notebookId, noteId } = useLocalSearchParams<{ notebookId: string; noteId: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      if (!notebookId || !noteId) return;
      setLoading(true);
      try {
        const notebookRef = doc(db, 'notebooks', notebookId);
        const notebookSnap = await getDoc(notebookRef);
        if (notebookSnap.exists()) {
          const notebookData = notebookSnap.data() as Notebook;
          const foundNote = (notebookData.notes || []).find((n: Note) => n.id === noteId);
          setNote(foundNote || null);
          setTitle(foundNote?.title || '');
          setContent(foundNote?.content || '');
          
        } else {
          setNote(null);
        }
      } catch (e) {
        setNote(null);
      }

      setLoading(false);
    };
    fetchNote();
  }, [notebookId, noteId]);

  // Not başlığı veya içeriği değiştiğinde Firestore'a kaydet
  useEffect(() => {
    if (!note || !notebookId || !noteId) return;
    if (title === note.title && content === note.content) return;
    const timeout = setTimeout(async () => {
      setSaving(true);
      try {
        const notebookRef = doc(db, 'notebooks', notebookId);
        const notebookSnap = await getDoc(notebookRef);
        if (notebookSnap.exists()) {
          const notebookData = notebookSnap.data() as Notebook;
          const notes = (notebookData.notes || []).map((n: Note) =>
            n.id === noteId ? { ...n, title, content, lastModified: new Date() } : n
          );
          await updateDoc(notebookRef, { notes });
        }
      } catch (e) {
        Alert.alert('Hata', 'Not kaydedilemedi');
      }
      setSaving(false);
    }, 700);
    return () => clearTimeout(timeout);
  }, [title, content]);

  

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Yükleniyor...</Text>
      </View>
    );
  }

  if (!note) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Not bulunamadı</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Sağ üstte çizim ekle ikonu */}
      
      <TextInput
        style={styles.title}
        value={title}
        onChangeText={setTitle}
        placeholder="Not başlığı"
        editable={!loading}
      />
      <TextInput
        style={styles.content}
        value={content}
        onChangeText={setContent}
        placeholder="Not içeriği"
        multiline
        editable={!loading}
      />
      
  {saving && <Text style={styles.saving}>Kaydediliyor...</Text>}
    </View>
  );
};


const styles = StyleSheet.create({
  saving: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'right',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1E293B',
    textAlign: 'left',
  },
  content: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
    textAlign: 'left',
  },
  // drawingPadWrapper ve saveButton kaldırıldı

});

export default NoteDetailScreen;

