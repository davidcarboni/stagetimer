import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TIMER_OPTIONS = [1, 3, 5, 10, 15, 20, 30, 45, 60]; // Timer options in minutes

interface TimeSelectionScreenProps {
  onTimeSelect: (minutes: number) => void;
}

const TimeSelectionScreen: React.FC<TimeSelectionScreenProps> = ({ onTimeSelect }) => {
  return (
    <View style={styles.selectionContainer}>
      {TIMER_OPTIONS.map(minutes => (
        <TouchableOpacity
          key={minutes}
          style={styles.timeButton}
          onPress={() => onTimeSelect(minutes)}
        >
          <Text style={styles.buttonText}>{minutes} min</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  selectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  timeButton: {
    margin: 10,
    padding: 20,
    backgroundColor: '#333',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
  },
});

export default TimeSelectionScreen;