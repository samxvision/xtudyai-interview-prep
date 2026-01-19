
'use client';

import { useState, useEffect, useCallback } from 'react';

const SPEAKER_MUTE_KEY = 'xtudyai-speaker-muted';

export const useSpeaker = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load mute state from localStorage on initial render
  useEffect(() => {
    try {
      const storedMuteState = localStorage.getItem(SPEAKER_MUTE_KEY);
      // Default to un-muted for first-time users so they discover the feature.
      setIsMuted(storedMuteState ? JSON.parse(storedMuteState) : false);
    } catch (error) {
      console.error("Failed to load speaker state from localStorage", error);
      setIsMuted(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (window.speechSynthesis.speaking) {
        setIsPlaying(false);
        setIsLoading(false);
        window.speechSynthesis.cancel();
      }
    }
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

  const speak = useCallback((text: string, lang: 'en-US' | 'hi-IN') => {
    // Stop any previous speech before starting a new one
    stop();

    if (typeof window === 'undefined' || !window.speechSynthesis || !text.trim()) {
      return;
    }
    
    setIsLoading(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    utterance.onstart = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (event) => {
      console.error('Web Speech API Error:', event);
      setIsLoading(false);
      setIsPlaying(false);
    };
    
    // The onvoiceschanged event is the only reliable way to get voices on many browsers.
    const loadVoicesAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice: SpeechSynthesisVoice | undefined;

      // --- Voice Selection Logic for Female voice ---
      if (lang === 'hi-IN') {
        // Prioritize a female Hindi voice, then Google's Hindi voice, then any Hindi voice
        selectedVoice = voices.find(v => v.lang === 'hi-IN' && /female|लड़की|महिला/i.test(v.name)) 
                        || voices.find(v => v.lang === 'hi-IN' && v.name.includes('Google')) 
                        || voices.find(v => v.lang === 'hi-IN');
      } else { // en-US
        // Prioritize a female English voice, then Google's English voice, then any English voice
        // Names like Zira, Susan, etc., are common for female voices.
        selectedVoice = voices.find(v => v.lang === 'en-US' && /female|zira|susan/i.test(v.name.toLowerCase())) 
                        || voices.find(v => v.lang === 'en-US' && v.name.includes('Google')) 
                        || voices.find(v => v.lang === 'en-US');
      }

      // Fallback for browsers that use underscores or just the language code (e.g., 'en' for 'en-US')
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.replace('_', '-') === lang);
      }
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith(lang.split('-')[0]));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = loadVoicesAndSpeak;
    } else {
      loadVoicesAndSpeak();
    }

  }, [stop]);

  // Stop speech when the component unmounts
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { isLoading, isPlaying, isMuted, toggleMute, speak, stop };
};
