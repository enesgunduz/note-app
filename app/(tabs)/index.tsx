import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { collection, query, where, onSnapshot, doc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Plus, BookOpen, Users } from 'lucide-react-native';
import NotebookCard from '@/components/notebook/NotebookCard';

interface Notebook {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: any;
  sharedWith: string[];
  lastModified: any;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [sharedNotebooks, setSharedNotebooks] = useState<Notebook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    console.log('User email:', user.email);
    console.log('User email (lowercase):', user.email?.toLowerCase());

    // Query for notebooks created by user
    const myNotebooksQuery = query(
      collection(db, 'notebooks'),
      where('createdBy', '==', user.uid)
    );

    // Query for notebooks shared with user
    const sharedNotebooksQuery = query(
      collection(db, 'notebooks'),
      where('sharedWith', 'array-contains', user.email?.toLowerCase())
    );

    let loadingCount = 2;
    const checkLoadingComplete = () => {
      loadingCount--;
      if (loadingCount === 0) {
        setLoading(false);
      }
    };

    // Subscribe to my notebooks
    const unsubscribeMyNotebooks = onSnapshot(myNotebooksQuery, (snapshot) => {
      const notebookData: Notebook[] = [];
      snapshot.forEach((doc) => {
        notebookData.push({ id: doc.id, ...doc.data() } as Notebook);
      });
      console.log('My notebooks loaded:', notebookData.length);
      setNotebooks(notebookData);
      checkLoadingComplete();
    }, (error) => {
      console.error('Error loading my notebooks:', error);
      checkLoadingComplete();
    });

    // Subscribe to shared notebooks
    const unsubscribeSharedNotebooks = onSnapshot(sharedNotebooksQuery, (snapshot) => {
      const sharedNotebookData: Notebook[] = [];
      snapshot.forEach((doc) => {
        sharedNotebookData.push({ id: doc.id, ...doc.data() } as Notebook);
      });
      console.log('Shared notebooks loaded:', sharedNotebookData.length);
      console.log('Shared notebooks data:', sharedNotebookData);
      setSharedNotebooks(sharedNotebookData);
      checkLoadingComplete();
    }, (error) => {
      console.error('Error loading shared notebooks:', error);
      checkLoadingComplete();
    });

    return () => {
      unsubscribeMyNotebooks();
      unsubscribeSharedNotebooks();
    };
  }, [user]);

  const createNotebook = async () => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'notebooks'), {
        title: 'New Notebook',
        description: 'Tap to add description',
        createdBy: user.uid,
        createdAt: new Date(),
        sharedWith: [],
        lastModified: new Date(),
        notes: [],
      });
    } catch (error) {
      console.error('Error creating notebook:', error);
    }
  };

  const deleteNotebook = async (notebookId: string) => {
    try {
      await deleteDoc(doc(db, 'notebooks', notebookId));
    } catch (error) {
      console.error('Error deleting notebook:', error);
    }
  };

  const renderNotebook = (notebook: Notebook, canDelete: boolean = true) => (
    <NotebookCard
      key={notebook.id}
      notebook={notebook}
      onPress={() => router.push(`/notebook/${notebook.id}`)}
      onDelete={canDelete ? deleteNotebook : undefined}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading notebooks...</Text>
          </View>
        ) : (
          <>
            {/* My Notebooks Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>My Notebooks</Text>
                <TouchableOpacity style={styles.addButton} onPress={createNotebook}>
                  <Plus size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.notebooksContainer}>
                {notebooks.length === 0 ? (
                  <View style={styles.emptyState}>
                    <BookOpen size={48} color="#CBD5E1" />
                    <Text style={styles.emptyTitle}>No notebooks yet</Text>
                    <Text style={styles.emptyDescription}>
                      Create your first notebook to get started
                    </Text>
                    <TouchableOpacity style={styles.createButton} onPress={createNotebook}>
                      <Plus size={20} color="#FFF" />
                      <Text style={styles.createButtonText}>Create Notebook</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  notebooks.map(notebook => renderNotebook(notebook, true))
                )}
              </View>
            </View>

            {/* Shared with Me Section */}
            {sharedNotebooks.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Shared with Me</Text>
                  <View style={styles.sharedBadge}>
                    <Users size={16} color="#2563EB" />
                    <Text style={styles.sharedBadgeText}>{sharedNotebooks.length}</Text>
                  </View>
                </View>
                
                <View style={styles.notebooksContainer}>
                  {sharedNotebooks.map(notebook => renderNotebook(notebook, false))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  addButton: {
    backgroundColor: '#2563EB',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
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
    marginBottom: 24,
    lineHeight: 20,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  createButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFF',
  },
  section: {
    marginBottom: 32,
  },
  notebooksContainer: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 28,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  sharedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  sharedBadgeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
});