import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { User, Edit2, Check } from 'lucide-react-native';
import { db } from '@/firebase';
import { doc, getDoc, updateDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { profileEditableSectionStyles as styles } from './styles/profileEditableSectionStyles';

export default function ProfileEditableSection({ user }: { user: any }) {
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (!user) return;
    const fetchUser = async () => {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        setDisplayName(data.displayName || '');
        setUsername(data.username || '');
      }
    };
    fetchUser();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    setUsernameError('');
    setSuccess(false);
    if (!username || username.length < 3) {
      setUsernameError('Username must be at least 3 characters.');
      setLoading(false);
      return;
    }
    const q = query(collection(db, 'users'), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty && querySnapshot.docs[0].id !== user.uid) {
      setUsernameError('This username is already taken.');
      setLoading(false);
      return;
    }
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { displayName, username });
    setSuccess(true);
    setEditing(false);
    setLoading(false);
  };

  return (
    <View style={styles.profileSection}>
      <View style={styles.profileAvatar}>
        <User size={32} color="#2563EB" />
      </View>
      <View style={styles.profileInfo}>
        {editing ? (
          <>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Your name"
            />
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Unique username"
              autoCapitalize="none"
            />
            {usernameError ? <Text style={styles.error}>{usernameError}</Text> : null}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Check size={20} color="#FFF" />}
            </TouchableOpacity>
            {success && <Text style={styles.success}>Saved!</Text>}
          </>
        ) : (
          <>
            <Text style={styles.profileName}>{displayName || 'User'}</Text>
            <Text style={styles.profileEmail}>@{username}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
              <Edit2 size={18} color="#2563EB" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
