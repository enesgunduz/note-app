

import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform, useWindowDimensions } from 'react-native';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { RotateCcw, Trash2 } from 'lucide-react-native';


interface DrawingPath {
  d: string;
  color: string;
}

interface DrawingPadProps {
  value?: string; // base64 SVG path
  onChange?: (value: string) => void;
  widthOverride?: number;
  heightOverride?: number;
}


export default function DrawingPad({ value, onChange, widthOverride, heightOverride }: DrawingPadProps) {
  const { width, height } = useWindowDimensions();
  // Mobilde safe area ve alt barlar için yükseklikten biraz düş
  // Canvas genişliği ekranın %95'i, max 600px, min 220px
  const canvasWidth = typeof widthOverride === 'number' ? widthOverride : Math.max(220, Math.min(width * 0.95, 600));
  const canvasHeight = typeof heightOverride === 'number' ? heightOverride : Math.max(180, height * 0.35); // biraz daha kısa, min 180px
  // Varsayılan renkler
  const COLORS = ['#2563EB', '#059669', '#F59E42', '#EF4444', '#A21CAF', '#000000'];
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [current, setCurrent] = useState<string | null>(null);
  const [currentColor, setCurrentColor] = useState(selectedColor);
  const isDrawing = useRef(false);


  const handleTouchStart = (e: any) => {
    isDrawing.current = true;
    const { locationX, locationY } = e.nativeEvent;
    setCurrent(`M${locationX},${locationY}`);
    setCurrentColor(selectedColor);
  };

  const handleTouchMove = (e: any) => {
    if (!isDrawing.current || !current) return;
    const { locationX, locationY } = e.nativeEvent;
    setCurrent(current + ` L${locationX},${locationY}`);
  };

  const handleTouchEnd = () => {
    if (current) {
      const newPaths = [...paths, { d: current, color: currentColor }];
      setPaths(newPaths);
      setCurrent(null);
      isDrawing.current = false;
      if (onChange) onChange(newPaths.map(p => p.d).join(' '));
    }
  };


  const handleClear = () => {
    setPaths([]);
    setCurrent(null);
    if (onChange) onChange('');
  };

  const handleUndo = () => {
    if (paths.length === 0) return;
    const newPaths = paths.slice(0, -1);
    setPaths(newPaths);
    if (onChange) onChange(newPaths.map(p => p.d).join(' '));
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        {/* Canvas için View kaldırıldı, doğrudan Canvas kullanılacak */}
        <Text style={{ color: '#64748B', textAlign: 'center', marginTop: 80 }}>
          Çizim özelliği sadece mobil cihazlarda çalışır.
        </Text>
      </View>
    );
  }


  return (
    <View style={[styles.container, { width: canvasWidth + 8 }]}> {/* 8px padding */}
      <Canvas
        style={{
          width: canvasWidth,
          height: canvasHeight,
          backgroundColor: '#FFF',
          borderRadius: 12,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {paths.map((p, i) => {
          if (!p.d || p.d.trim() === '') return null;
          let skiaPath;
          try {
            skiaPath = Skia.Path.MakeFromSVGString(p.d);
          } catch (e) {
            skiaPath = undefined;
          }
          if (!skiaPath) return null;
          return (
            <Path key={i} path={skiaPath} color={p.color} style="stroke" strokeWidth={3} />
          );
        })}
        {current && current.trim() !== '' && (() => {
          let skiaPath;
          try {
            skiaPath = Skia.Path.MakeFromSVGString(current);
          } catch (e) {
            skiaPath = undefined;
          }
          if (!skiaPath) return null;
          return (
            <Path path={skiaPath} color={currentColor} style="stroke" strokeWidth={3} />
          );
        })()}
      </Canvas>
      {/* Palet ve butonlar tek satırda */}
      <View style={[styles.paletteButtonRow, { width: canvasWidth, flexWrap: 'wrap', alignSelf: 'center' }]}> 
        <View style={styles.paletteRow}>
          {COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[styles.colorCircle, { backgroundColor: color, borderWidth: selectedColor === color ? 2 : 0, borderColor: '#64748B' }]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.iconButton} onPress={handleUndo}>
            <RotateCcw size={20} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleClear}>
            <Trash2 size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 0,
  },
  paletteButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 12,
    flexWrap: 'wrap',
    alignSelf: 'center',
  },
  paletteRow: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 2,
    borderWidth: 0,
  },
  // canvas stilini kaldırıyoruz, dinamik olarak yukarıda veriliyor
  buttonRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginLeft: 8,
  },
  iconButton: {
    backgroundColor: '#F1F5F9',
    padding: 6,
    borderRadius: 16,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
