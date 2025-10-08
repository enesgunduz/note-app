import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { X, Users, Share } from 'lucide-react-native';

interface Friend {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

interface ShareModalProps {
  visible: boolean;
  friends: Friend[];
  sharedWith: string[];
  onClose: () => void;
  onShareWithFriend: (friend: Friend) => void;
}

export default function ShareModal({
  visible,
  friends,
  sharedWith,
  onClose,
  onShareWithFriend,
}: ShareModalProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Share with Friends</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={20} color="#64748B" />
          </TouchableOpacity>
        </View>
        
        {friends.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Users size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No friends yet</Text>
            <Text style={styles.emptyDescription}>
              Add friends from the Friends tab to share notebooks with them
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.friendsList} showsVerticalScrollIndicator={false}>
            {friends.map((friend) => (
              <TouchableOpacity
                key={friend.uid}
                style={[
                  styles.friendItem,
                  sharedWith.includes(friend.email.toLowerCase()) && styles.friendItemShared
                ]}
                onPress={() => onShareWithFriend(friend)}
                disabled={sharedWith.includes(friend.email.toLowerCase())}
              >
                <View style={styles.friendInfo}>
                  <View style={styles.friendAvatar}>
                    <Text style={styles.friendAvatarText}>
                      {(friend.displayName || friend.email).charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.friendDetails}>
                    <Text style={styles.friendName}>
                      {friend.displayName || friend.email}
                    </Text>
                    <Text style={styles.friendEmail}>{friend.email}</Text>
                  </View>
                </View>
                <View style={styles.shareIndicator}>
                  {sharedWith.includes(friend.email.toLowerCase()) ? (
                    <Text style={styles.sharedLabel}>Shared</Text>
                  ) : (
                    <Share size={18} color="#2563EB" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  closeButton: {
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
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
  friendsList: {
    maxHeight: 300,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  friendItemShared: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  friendAvatarText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1E293B',
    marginBottom: 2,
  },
  friendEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  shareIndicator: {
    marginLeft: 12,
  },
  sharedLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#059669',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});
