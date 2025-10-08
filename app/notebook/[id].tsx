import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, SafeAreaView, Alert, Modal, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc, onSnapshot, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';
import NavigationHeader from '@/components/notebook/NavigationHeader';
import NotebookHeader from '@/components/notebook/NotebookHeader';
import NotesSection from '@/components/notebook/NotesSection';
import ShareModal from '@/components/notebook/ShareModal';
import DrawingPad from '@/components/notebook/DrawingPad';
import { LoadingScreen, ErrorScreen } from '@/components/notebook/ScreenStates';
import { PlusCircle } from 'lucide-react-native';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: any;
  lastModified: any;
}

interface Notebook {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: any;
  sharedWith: string[];
  lastModified: any;
  notes: Note[];
}

interface Friend {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export default function NotebookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [notebook, setNotebook] = useState<Notebook | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    if (!id || !user) return;

    const unsubscribe = onSnapshot(doc(db, 'notebooks', id), (doc) => {
      if (doc.exists()) {
        const data = { id: doc.id, ...doc.data() } as Notebook;
        setNotebook(data);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [id, user]);

  // Load friends list
  useEffect(() => {
    const loadFriends = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData?.friends && userData.friends.length > 0) {
            const friendsData: Friend[] = [];
            for (const friendId of userData.friends) {
              const friendDoc = await getDoc(doc(db, 'users', friendId));
              if (friendDoc.exists()) {
                friendsData.push({ uid: friendId, ...friendDoc.data() } as Friend);
              }
            }
            setFriends(friendsData);
          }
        }
      } catch (error) {
        console.error('Error loading friends:', error);
      }
    };

    loadFriends();
  }, [user]);

  const updateTitle = async (title: string) => {
    if (!notebook) return;

    try {
      await updateDoc(doc(db, 'notebooks', notebook.id), {
        title,
        lastModified: new Date(),
      });
    } catch (error) {
      console.error('Error updating title:', error);
      Alert.alert('Error', 'Failed to update title');
    }
  };

  const updateDescription = async (description: string) => {
    if (!notebook) return;

    try {
      await updateDoc(doc(db, 'notebooks', notebook.id), {
        description,
        lastModified: new Date(),
      });
    } catch (error) {
      console.error('Error updating description:', error);
      Alert.alert('Error', 'Failed to update description');
    }
  };

  const addNote = async () => {
    if (!notebook || !user) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: 'Start writing...',
      createdAt: new Date(),
      lastModified: new Date(),
    };

    try {
      await updateDoc(doc(db, 'notebooks', notebook.id), {
        notes: arrayUnion(newNote),
        lastModified: new Date(),
      });
    } catch (error) {
      console.error('Error adding note:', error);
      Alert.alert('Error', 'Failed to add note');
    }
  };

  const updateNote = async (noteId: string, updates: Partial<Note>) => {
    if (!notebook) return;

    const updatedNotes = notebook.notes.map(note =>
      note.id === noteId
        ? { ...note, ...updates, lastModified: new Date() }
        : note
    );

    try {
      await updateDoc(doc(db, 'notebooks', notebook.id), {
        notes: updatedNotes,
        lastModified: new Date(),
      });
    } catch (error) {
      console.error('Error updating note:', error);
      Alert.alert('Error', 'Failed to update note');
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!notebook) return;

    const noteToDelete = notebook.notes.find(note => note.id === noteId);
    if (!noteToDelete) return;

    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateDoc(doc(db, 'notebooks', notebook.id), {
                notes: arrayRemove(noteToDelete),
                lastModified: new Date(),
              });
            } catch (error) {
              console.error('Error deleting note:', error);
              Alert.alert('Error', 'Failed to delete note');
            }
          },
        },
      ]
    );
  };

  const shareNotebook = async (friend: Friend) => {
    if (!notebook || !user) return;

    try {
      await updateDoc(doc(db, 'notebooks', notebook.id), {
        sharedWith: arrayUnion(friend.email.toLowerCase()),
        lastModified: new Date(),
      });
      setShowShareModal(false);
      Alert.alert('Success', `Notebook shared with ${friend.displayName || friend.email}!`);
    } catch (error) {
      console.error('Error sharing notebook:', error);
      Alert.alert('Error', 'Failed to share notebook');
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!notebook) {
    return <ErrorScreen onButtonPress={() => router.back()} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <NavigationHeader 
        onBack={() => router.back()}
        onShare={() => setShowShareModal(true)}
      />

      {/* Canvas açma butonu */}
      <View style={{ alignItems: 'flex-end', margin: 12 }}>
        <TouchableOpacity onPress={() => setShowCanvas(true)} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', padding: 8, borderRadius: 8 }}>
          <PlusCircle size={20} color="#2563EB" />
          <Text style={{ marginLeft: 6, color: '#2563EB', fontWeight: 'bold' }}>Çizim Ekle</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showCanvas} animationType="slide" onRequestClose={() => setShowCanvas(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 12 }}>
            <TouchableOpacity onPress={() => setShowCanvas(false)} style={{ backgroundColor: '#F1F5F9', padding: 8, borderRadius: 8 }}>
              <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>Kapat</Text>
            </TouchableOpacity>
          </View>
          <DrawingPad />
        </SafeAreaView>
      </Modal>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <NotebookHeader
          title={notebook.title}
          description={notebook.description}
          sharedWithCount={notebook.sharedWith.length}
          lastModified={notebook.lastModified?.toDate?.()?.toLocaleDateString() || 'Recently'}
          onTitleUpdate={updateTitle}
          onDescriptionUpdate={updateDescription}
        />

        <NotesSection
          notes={notebook.notes || []}
          notebookId={notebook.id}
          onAddNote={addNote}
          onUpdateNote={updateNote}
          onDeleteNote={deleteNote}
        />
      </ScrollView>

      <ShareModal
        visible={showShareModal}
        friends={friends}
        sharedWith={notebook.sharedWith}
        onClose={() => setShowShareModal(false)}
        onShareWithFriend={shareNotebook}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});