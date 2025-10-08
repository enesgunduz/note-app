import { friendStyles } from '../../components/styles/friendStyles';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';
import { Search, Users, Mail } from 'lucide-react-native';
import FriendCard from '../../components/FriendCard';
import SearchResultCard from '../../components/SearchResultCard';

interface Friend {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export default function FriendsScreen() {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFriends();
  }, [user]);

  const loadFriends = async () => {
    if (!user) return;

    console.log('Loading friends for user:', user.uid);
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('User data:', userData);
        
        if (userData?.friends?.length > 0) {
          console.log('User has friends:', userData.friends);
          const friendsData: Friend[] = [];
          for (const friendId of userData.friends) {
            console.log('Loading friend:', friendId);
            const friendDoc = await getDoc(doc(db, 'users', friendId));
            if (friendDoc.exists()) {
              const friendData = { uid: friendId, ...friendDoc.data() } as Friend;
              console.log('Friend data:', friendData);
              friendsData.push(friendData);
            }
          }
          console.log('All friends loaded:', friendsData);
          setFriends(friendsData);
        } else {
          console.log('User has no friends');
          setFriends([]);
        }
      } else {
        console.log('User document does not exist');
        setFriends([]);
      }
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  };

  const searchUsers = async () => {
    if (!searchEmail.trim() || !user) return;

    console.log('Searching for user with email:', searchEmail.trim().toLowerCase());
    setLoading(true);
    try {
      const q = query(
        collection(db, 'users'),
        where('email', '==', searchEmail.toLowerCase().trim())
      );
      
      const querySnapshot = await getDocs(q);
      const results: Friend[] = [];
      
      console.log('Query snapshot size:', querySnapshot.size);
      
      querySnapshot.forEach((doc) => {
        console.log('Found user:', doc.data());
        const userData = doc.data() as Friend;
        if (userData.uid !== user.uid) {
          results.push(userData);
        }
      });
      
      console.log('Search results:', results);
      setSearchResults(results);
      
      if (results.length === 0) {
        Alert.alert('No Results', 'No user found with this email address.');
      }
    } catch (error) {
      console.error('Error searching users:', error);
      Alert.alert('Error', 'Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const addFriend = async (friendData: Friend) => {
    if (!user) return;

    console.log('Adding friend:', friendData);
    try {
      // Add friend to current user's friends list
      console.log('Adding to current user friends list...');
      await updateDoc(doc(db, 'users', user.uid), {
        friends: arrayUnion(friendData.uid)
      });

      // Add current user to friend's friends list
      console.log('Adding current user to friend friends list...');
      await updateDoc(doc(db, 'users', friendData.uid), {
        friends: arrayUnion(user.uid)
      });

      console.log('Friend added successfully');
      setFriends([...friends, friendData]);
      setSearchResults([]);
      setSearchEmail('');
      Alert.alert('Success', `${friendData.displayName} has been added as a friend!`);
    } catch (error) {
      console.error('Error adding friend:', error);
      Alert.alert('Error', 'Failed to add friend');
    }
  };

  const renderFriend = (friend: Friend) => (
    <FriendCard key={friend.uid} friend={friend} />
  );

  const renderSearchResult = (result: Friend) => {
    const isAlreadyFriend = friends.some(friend => friend.uid === result.uid);
    return (
      <SearchResultCard
        key={result.uid}
        result={result}
        isAlreadyFriend={isAlreadyFriend}
        onAdd={addFriend}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Friends</Text>
      </View>

      <View style={friendStyles.searchSection}>
        <View style={friendStyles.searchContainer}>
          <Mail size={20} color="#64748B" />
          <TextInput
            style={friendStyles.searchInput}
            placeholder="Search by email"
            value={searchEmail}
            onChangeText={setSearchEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={friendStyles.searchButton}
            onPress={searchUsers}
            disabled={loading}
          >
            <Search size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={friendStyles.content} showsVerticalScrollIndicator={false}>
        {searchResults.length > 0 && (
          <View style={friendStyles.section}>
            <Text style={friendStyles.sectionTitle}>Search Results</Text>
            {searchResults.map(renderSearchResult)}
          </View>
        )}

        <View style={friendStyles.section}>
          <Text style={friendStyles.sectionTitle}>My Friends ({friends.length})</Text>
          {friends.length === 0 ? (
            <View style={styles.emptyState}>
              <Users size={48} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No friends yet</Text>
              <Text style={styles.emptyDescription}>
                Search for friends by email to start collaborating
              </Text>
            </View>
          ) : (
            friends.map(renderFriend)
          )}
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
  },
  friendEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  addButton: {
    backgroundColor: '#059669',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alreadyFriendText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#059669',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
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
    lineHeight: 20,
  },
});