"use client";

import { useState, useEffect } from 'react';
import { Mic, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';

interface SearchFormProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
  onSearchStart?: () => void;
  onSearchEnd?: () => void;
  className?: string;
  isFixed?: boolean;
}

export function SearchForm({
  initialQuery = '',
  onSearch,
  onSearchStart,
  onSearchEnd,
  className,
  isFixed = false,
}: SearchFormProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const { isLoading: areQuestionsLoading } = useAppContext();
  const {
    transcript,
    isListening,
    startListening,
    isSupported: isSpeechSupported,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = () => {
    if (!query.trim() || isSearching) return;

    setIsSearching(true);
    onSearchStart?.();

    if (onSearch) {
      onSearch(query);
    } else {
        toast({
            title: 'No search handler configured',
            description: 'The search action is not implemented.',
            variant: 'destructive',
        });
    }

    setIsSearching(false);
    onSearchEnd?.();
  };

  const handleVoiceSearch = () => {
    if (!isSpeechSupported) {
      toast({
        title: 'Voice Search Not Supported',
        description: 'Your browser does not support voice recognition.',
        variant: 'destructive',
      });
      return;
    }
    startListening('en-US'); // Can be toggled to 'hi-IN'
  };

  return (
    <Card className={className}>
      <div className="flex w-full items-center space-x-2 p-2">
        <Input
          type="text"
          placeholder="Type your question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-grow text-base"
          aria-label="Search question"
          disabled={isSearching || areQuestionsLoading}
        />
        <Button
          variant="secondary"
          size="icon"
          onClick={handleVoiceSearch}
          disabled={isSearching || areQuestionsLoading}
          className={`${isListening ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'bg-primary/20 hover:bg-primary/30'}`}
          aria-label="Search with voice"
        >
          <Mic className="h-5 w-5" />
        </Button>
        <Button onClick={handleSearch} disabled={isSearching || !query.trim() || areQuestionsLoading} className="bg-foreground hover:bg-foreground/90">
          {isSearching ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Search className="h-5 w-5" />
          )}
          <span className="hidden sm:inline ml-2">Search</span>
        </Button>
      </div>
    </Card>
  );
}
