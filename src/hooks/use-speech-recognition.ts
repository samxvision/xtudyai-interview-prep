
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

type SpeechRecognitionHook = {
  isListening: boolean;
  transcript: string;
  error: string | null;
  isSupported: boolean;
  startListening: (lang: 'en-US' | 'hi-IN') => void;
  stopListening: () => void;
};

// Guard for SSR
const SpeechRecognition =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      // Don't reset transcript here, keep the last final transcript
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      
      // Iterate through all results from the current recognition
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          // Append final transcript segment, add a space if there's existing content
          const finalSegment = event.results[i][0].transcript;
          finalTranscriptRef.current += (finalTranscriptRef.current ? ' ' : '') + finalSegment;
        } else {
          // Collect the latest interim transcript
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      // Update the display text by combining the stable final transcript
      // with the fluctuating interim part.
      setTranscript((finalTranscriptRef.current + ' ' + interimTranscript).trim());
    };

    recognition.onerror = (event) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setError(event.error);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    
    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.abort();
        }
    };
  }, []);

  const startListening = useCallback((lang: 'en-US' | 'hi-IN' = 'en-US') => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.lang = lang;
      setTranscript(''); // Clear visual transcript
      finalTranscriptRef.current = ''; // Reset internal final transcript
      setError(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'NotAllowedError') {
          setError('Microphone permission denied.');
        } else {
          setError('Speech recognition could not be started.');
        }
        setIsListening(false);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    error,
    isSupported: !!SpeechRecognition,
    startListening,
    stopListening,
  };
};
