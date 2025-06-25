import { useKeepAwake } from 'expo-keep-awake';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

const TIMER_OPTIONS = [1, 3, 5, 10, 15, 20, 30];
const WARNING_THRESHOLD = 60; // 1 minute in seconds
const FINAL_THRESHOLD = 30; // 30 seconds in seconds

export default function App() {
  useKeepAwake();
  const [timeLeft, setTimeLeft] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [bgColor, setBgColor] = useState('black');
  const [textColor, setTextColor] = useState('red');
  const timerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const flashIntervalRef = useRef(null);
  const { width, height } = useWindowDimensions();

  // Handle timer countdown
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;

          // Handle color changes
          if (newTime <= FINAL_THRESHOLD) {
            setBgColor(prevColor => {
              if (prevColor === 'black') {
                setTextColor('black');
                return 'red';
              }
              setTextColor('red');
              return 'black';
            });
          } else if (newTime <= WARNING_THRESHOLD) {
            setBgColor('orange');
            setTextColor('red');
          } else {
            setBgColor('black');
            setTextColor('red');
          }

          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      setBgColor('black');
      setTextColor('red');
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft]);

  // Handle controls visibility timeout
  useEffect(() => {
    if (showControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => clearTimeout(controlsTimeoutRef.current);
  }, [showControls]);

  const startTimer = (minutes) => {
    clearInterval(flashIntervalRef.current);
    setTimeLeft(minutes * 60);
    setIsRunning(true);
    setBgColor('black');
    setTextColor('red');
    setShowControls(true);
  };

  const togglePause = () => {
    setIsRunning(!isRunning);
    setShowControls(true);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    clearInterval(flashIntervalRef.current);
    setTimeLeft(null);
    setIsRunning(false);
    setBgColor('black');
    setTextColor('red');
    setShowControls(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLandscape = width > height;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: bgColor }]}
      activeOpacity={1}
      onPress={() => setShowControls(true)}
    >
      {timeLeft === null ? (
        <View style={styles.selectionContainer}>
          {TIMER_OPTIONS.map(minutes => (
            <TouchableOpacity
              key={minutes}
              style={styles.timeButton}
              onPress={() => startTimer(minutes)}
            >
              <Text style={styles.buttonText}>{minutes} min</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={[styles.timerText, { color: textColor }, isLandscape && styles.timerTextLandscape]}>{formatTime(timeLeft)}</Text>
      )}

      {showControls && timeLeft !== null && (
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={[styles.controlButton, timeLeft <= WARNING_THRESHOLD && timeLeft > FINAL_THRESHOLD && styles.controlButtonOrange]} onPress={togglePause}>
            <Text style={[styles.controlText, timeLeft <= WARNING_THRESHOLD && timeLeft > FINAL_THRESHOLD && styles.controlTextOrange]}>{isRunning ? 'Pause' : 'Resume'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.controlButton, timeLeft <= WARNING_THRESHOLD && timeLeft > FINAL_THRESHOLD && styles.controlButtonOrange]} onPress={resetTimer}>
            <Text style={[styles.controlText, timeLeft <= WARNING_THRESHOLD && timeLeft > FINAL_THRESHOLD && styles.controlTextOrange]}>Reset</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
