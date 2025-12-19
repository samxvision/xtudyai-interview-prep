
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

  useEffect(() => {
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
        // This is called when recognition starts
    };
    
    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcriptSegment = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcriptSegment;
            } else {
                interimTranscript += transcriptSegment;
            }
        }
        
        // Update the state with the combined transcript.
        // This rebuilds the transcript from scratch on each result, preventing duplication.
        setTranscript(finalTranscript + interimTranscript);
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
      setTranscript(''); // Clear previous transcript on new start
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

