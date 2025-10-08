import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft, Share } from 'lucide-react-native';

interface NavigationHeaderProps {
  onBack: () => void;
  onShare: () => void;
}

export default function NavigationHeader({ onBack, onShare }: NavigationHeaderProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onBack}>
        <ArrowLeft size={24} color="#1E293B" />
      </TouchableOpacity>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={onShare}>
          <Share size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  button: {
    padding: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
});
