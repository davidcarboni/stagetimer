import { useKeepAwake } from 'expo-keep-awake';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import CountdownScreen from './components/CountdownScreen';
import TimeSelectionScreen from './components/TimeSelectionScreen';
import { useTimerStore } from './store/timerStore';

const WARNING_THRESHOLD = 60; // 1 minute in seconds
const FINAL_THRESHOLD = 30; // 30 seconds in seconds

export default function App() {
  useKeepAwake();
  const { targetTime, isRunning, pausedTime, setTargetTime, setIsRunning, setPausedTime, reset } = useTimerStore();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [bgColor, setBgColor] = useState('black');
  const [textColor, setTextColor] = useState('red');
  const timerRef = useRef<number | null>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  // Rehydrate timeLeft from persisted state
  useEffect(() => {
    if (pausedTime) {
      setTimeLeft(pausedTime);
    } else if (targetTime) {
      const newTime = Math.max(0, Math.round((targetTime - Date.now()) / 1000));
      if (newTime > 0) {
        setTimeLeft(newTime);
      } else {
        // Timer has already expired
        reset();
      }
    } else {
      setTimeLeft(null);
    }
  }, [targetTime, reset]);

  // Handle timer countdown
  useEffect(() => {
    if (isRunning && targetTime) {
      timerRef.current = setInterval(() => {
        const newTime = Math.max(0, Math.round((targetTime - Date.now()) / 1000));
        setTimeLeft(newTime);

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
        } else {
          setBgColor('black');
        }
        if (newTime === 0) {
          setIsRunning(false);
        }
      }, 250);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, targetTime]);

  // Handle controls visibility timeout
  useEffect(() => {
    if (showControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [showControls]);

  const startTimer = (minutes: number) => {
    const durationInSeconds = minutes * 60;
    const newTargetTime = Date.now() + durationInSeconds * 1000;
    setTargetTime(newTargetTime);
    setTimeLeft(durationInSeconds);
    setIsRunning(true);
    setBgColor('black');
    setTextColor('red');
    setShowControls(true);
    setPausedTime(null);
  };

  const togglePause = () => {
    if (isRunning) {
      // Pausing
      setIsRunning(false);
      setPausedTime(timeLeft);
      // We don't clear targetTime so we can resume
    } else {
      // Resuming
      if (timeLeft !== null && timeLeft > 0) {
        const newTargetTime = Date.now() + timeLeft * 1000;
        setTargetTime(newTargetTime);
        setIsRunning(true);
        setPausedTime(null);
      }
    }
    setShowControls(true);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    reset();
    setTimeLeft(null);
    setBgColor('black');
    setTextColor('red');
    setShowControls(true);
  };

  return (
    <>
      <StatusBar hidden={true} />
      <TouchableOpacity
        style={[styles.container, { backgroundColor: bgColor }]}
        activeOpacity={1}
        onPress={() => setShowControls(true)}
      >
        {targetTime === null ? (
          <TimeSelectionScreen onTimeSelect={startTimer} />
        ) : (
          timeLeft !== null && (
            <CountdownScreen
              timeLeft={timeLeft}
              textColor={textColor}
              isRunning={isRunning}
              onTogglePause={togglePause}
              onReset={resetTimer}
              showControls={showControls}
              isWarning={timeLeft <= WARNING_THRESHOLD}
              isFinal={timeLeft <= FINAL_THRESHOLD}
            />
          )
        )}
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});