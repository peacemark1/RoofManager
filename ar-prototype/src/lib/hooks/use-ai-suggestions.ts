'use client';

import { useState, useCallback } from 'react';

export interface AISuggestion {
  title: string;
  description: string;
  layoutHints: string[];
}

export interface AISuggestionsResponse {
  suggestions: AISuggestion[];
}

interface UseAISuggestionsReturn {
  suggestions: AISuggestion[];
  isLoading: boolean;
  error: string | null;
  fetchSuggestions: (prompt: string) => Promise<void>;
  reset: () => void;
}

export function useAISuggestions(): UseAISuggestionsReturn {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async (prompt: string) => {
    if (!prompt.trim()) {
      setError('Prompt cannot be empty');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context: prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch suggestions');
      }

      const data: AISuggestionsResponse = await response.json();

      // Transform API response to match expected format
      const transformedSuggestions: AISuggestion[] = (data.suggestions || []).map(
        (item: AISuggestion, index: number) => ({
          title: item.title || `Suggestion ${index + 1}`,
          description: item.description,
          layoutHints: item.layoutHints || [],
        })
      );

      setSuggestions(transformedSuggestions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setSuggestions([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    fetchSuggestions,
    reset,
  };
}
