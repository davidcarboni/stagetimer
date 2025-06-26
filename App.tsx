import { useKeepAwake } from 'expo-keep-awake';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import CountdownScreen from './components/CountdownScreen';
import TimeSelectionScreen from './components/TimeSelectionScreen';
import { useTimerStore } from './store/timerStore';
import { Colors } from './constants/Colors';

export default function App() {
  useKeepAwake();
  const { targetTime, isRunning, pausedTime, duration, setTargetTime, setIsRunning, setPausedTime, setDuration, reset } =
    useTimerStore();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [bgColor, setBgColor] = useState(Colors.timer.black);
  const [textColor, setTextColor] = useState(Colors.timer.red);
  const [warningThreshold, setWarningThreshold] = useState(60);
  const [finalThreshold, setFinalThreshold] = useState(30);
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
  }, [targetTime, reset, pausedTime, duration]);

  // Handle timer countdown
  useEffect(() => {
    if (isRunning && targetTime) {
      timerRef.current = setInterval(() => {
        const newTime = Math.max(0, Math.round((targetTime - Date.now()) / 1000));
        setTimeLeft(newTime);

        // Handle color changes
        if (newTime <= finalThreshold) {
          setBgColor(prevColor => {
            if (prevColor === Colors.timer.black) {
              setTextColor(Colors.timer.black);
              return Colors.timer.red;
            }
            setTextColor(Colors.timer.red);
            return Colors.timer.black;
          });
        } else if (newTime <= warningThreshold) {
          setBgColor(Colors.timer.orange);
          setTextColor(Colors.timer.white);
        } else {
          setBgColor(Colors.timer.black);
          setTextColor(Colors.timer.red);
        }
        if (newTime === 0) {
          setIsRunning(false);
        }
      }, 500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, targetTime, finalThreshold, warningThreshold, setIsRunning]);

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

  const calculateRoundedThreshold = (totalDuration: number, percentage: number): number => {
    const threshold = totalDuration * percentage;
    let roundingIncrement = 5;
    if (totalDuration > 600) {
      roundingIncrement = 60;
    } else if (totalDuration > 300) {
      roundingIncrement = 30;
    } else if (totalDuration > 60) {
      roundingIncrement = 10;
    }
    return Math.round(threshold / roundingIncrement) * roundingIncrement;
  };

  const startTimer = (minutes: number) => {
    const durationInSeconds = minutes * 60;
    setDuration(minutes);
    setWarningThreshold(calculateRoundedThreshold(durationInSeconds, 0.2));
    setFinalThreshold(calculateRoundedThreshold(durationInSeconds, 0.1));
    const newTargetTime = Date.now() + durationInSeconds * 1000;
    setTargetTime(newTargetTime);
    setTimeLeft(durationInSeconds);
    setIsRunning(true);
    setBgColor(Colors.timer.black);
    setTextColor(Colors.timer.red);
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
      // Resuming or restarting
      if (timeLeft !== null && timeLeft > 0) {
        const newTargetTime = Date.now() + timeLeft * 1000;
        setTargetTime(newTargetTime);
        setIsRunning(true);
        setPausedTime(null);
      } else if (duration) {
        // Restarting
        startTimer(duration);
      }
    }
    setShowControls(true);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    reset();
    setTimeLeft(null);
    setBgColor(Colors.timer.black);
    setTextColor(Colors.timer.red);
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
              isWarning={timeLeft <= warningThreshold}
              isFinal={timeLeft <= finalThreshold}
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