import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

interface CountdownScreenProps {
  timeLeft: number;
  textColor: string;
  isRunning: boolean;
  onTogglePause: () => void;
  onReset: () => void;
  showControls: boolean;
  isWarning: boolean;
  isFinal: boolean;
}

const CountdownScreen: React.FC<CountdownScreenProps> = ({
  timeLeft,
  textColor,
  isRunning,
  onTogglePause,
  onReset,
  showControls,
  isWarning,
  isFinal,
}) => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Text style={[styles.timerText, { color: textColor }, isLandscape && styles.timerTextLandscape]}>
        {formatTime(timeLeft)}
      </Text>

      {showControls && (
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={[styles.controlButton, isWarning && !isFinal && styles.controlButtonOrange]} onPress={onTogglePause}>
            <Text style={[styles.controlText, isWarning && !isFinal && styles.controlTextOrange]}>{isRunning ? 'Pause' : 'Resume'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.controlButton, isWarning && !isFinal && styles.controlButtonOrange]} onPress={onReset}>
            <Text style={[styles.controlText, isWarning && !isFinal && styles.controlTextOrange]}>Reset</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  timerTextLandscape: {
    fontSize: 200,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
  },
  controlButton: {
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
  },
  controlText: {
    color: 'white',
    fontSize: 18,
  },
  controlButtonOrange: {
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  controlTextOrange: {
    color: 'black',
  },
});

export default CountdownScreen;