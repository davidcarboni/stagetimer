import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

const TIMER_OPTIONS = [1, 3, 5, 10, 15, 20, 30, 45, 60]; // Timer options in minutes

interface TimeSelectionScreenProps {
  onTimeSelect: (minutes: number) => void;
}

const TimeSelectionScreen: React.FC<TimeSelectionScreenProps> = ({ onTimeSelect }) => {
  return (
    <SafeAreaView style={styles.container}>
      {TIMER_OPTIONS.map(minutes => (
        <TouchableOpacity
          key={minutes}
          style={styles.timeButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onTimeSelect(minutes);
          }}
        >
          <Text style={styles.buttonText}>{minutes} min</Text>
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
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