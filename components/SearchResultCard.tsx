import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Users, UserPlus } from 'lucide-react-native';
import { friendStyles as styles } from './styles/friendStyles';

interface Friend {
  uid: string;
  displayName: string;
  email: string;
}

interface SearchResultCardProps {
  result: Friend;
  isAlreadyFriend: boolean;
  onAdd: (friend: Friend) => void;
}

export default function SearchResultCard({ result, isAlreadyFriend, onAdd }: SearchResultCardProps) {
  return (
    <View style={styles.searchResultCard}>
      <View style={styles.friendAvatar}>
        <Users size={24} color="#2563EB" />
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{result.displayName}</Text>
        <Text style={styles.friendEmail}>{result.email}</Text>
      </View>
      {!isAlreadyFriend && (
        <TouchableOpacity style={styles.addButton} onPress={() => onAdd(result)}>
          <UserPlus size={20} color="#FFF" />
        </TouchableOpacity>
      )}
      {isAlreadyFriend && (
        <Text style={styles.alreadyFriendText}>Friend</Text>
      )}
    </View>
  );
}
