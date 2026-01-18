
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const SPEAKER_MUTE_KEY = 'xtudyai-speaker-muted';

export const useSpeaker = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load mute state from localStorage on initial render
  useEffect(() => {
    try {
      const storedMuteState = localStorage.getItem(SPEAKER_MUTE_KEY);
      // Default to un-muted for first-time users
      setIsMuted(storedMuteState ? JSON.parse(storedMuteState) : false);
    } catch (error) {
      console.error("Failed to load speaker state from localStorage", error);
      setIsMuted(false);
    }
  }, []);

  const stop = useCallback(() => {
      if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      setAudioUrl(null);
      setIsLoading(false);
  }, []);

  // Persist mute state to localStorage
  const toggleMute = useCallback(() => {
    setIsMuted(prevMuted => {
      const newMutedState = !prevMuted;
      try {
        localStorage.setItem(SPEAKER_MUTE_KEY, JSON.stringify(newMutedState));
        if (newMutedState) {
          // If muting, stop current playback
          stop();
        }
      } catch (error) {
        console.error("Failed to save speaker state to localStorage", error);
      }
      return newMutedState;
    });
  }, [stop]);

  const speak = useCallback(async (text: string, lang: 'en-US' | 'hi-IN') => {
    // Stop any previous speech before starting a new one
    stop();

    if (!text.trim() || isMuted) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, lang }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || 'Failed to fetch speech data.');
      }
      const data = await response.json();
      setAudioUrl(data.audioDataUri);
    } catch (error) {
      console.error("TTS Error:", error);
      setAudioUrl(null);
    } finally {
      setIsLoading(false);
    }
  }, [isMuted, stop]);


  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => {
            setIsPlaying(false);
            setAudioUrl(null); // Clear URL after finishing
        };
        
        audioElement.addEventListener('play', handlePlay);
        audioElement.addEventListener('playing', handlePlay);
        audioElement.addEventListener('pause', handlePause);
        audioElement.addEventListener('ended', handleEnded);

        return () => {
            if (audioElement){
                audioElement.removeEventListener('play', handlePlay);
                audioElement.removeEventListener('playing', handlePlay);
                audioElement.removeEventListener('pause', handlePause);
                audioElement.removeEventListener('ended', handleEnded);
            }
        }
    }
  }, [audioUrl]);

  return { isLoading, isPlaying, isMuted, toggleMute, speak, stop, audioRef, audioUrl };
};
