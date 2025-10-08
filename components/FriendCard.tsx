import React from 'react';
import { View, Text } from 'react-native';
import { Users } from 'lucide-react-native';
import { friendStyles as styles } from './styles/friendStyles';

interface FriendCardProps {
  friend: {
    uid: string;
    displayName: string;
    email: string;
  };
}

export default function FriendCard({ friend }: FriendCardProps) {
  return (
    <View style={styles.friendCard}>
      <View style={styles.friendAvatar}>
        <Users size={24} color="#2563EB" />
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{friend.displayName}</Text>
        <Text style={styles.friendEmail}>{friend.email}</Text>
      </View>
    </View>
  );
}
