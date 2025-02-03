"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, {
  AddFrame,
  SignIn as SignInCore,
  type Context,
} from "@farcaster/frame-sdk";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { useQuery, QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';

// ... other imports remain the same ...

async function fetchGroundhogPredictions() {
  try {
    const response = await fetch(`${GROUNDHOG_API_BASE}/groundhogs`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `HTTP error! status: ${response.status}`
      );
    }
    
    return response.json() as Promise<Groundhog[]>;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(
      error instanceof Error 
        ? error.message
        : 'Failed to fetch predictions. Please check the API endpoint.'
    );
  }
}

function GroundhogPredictions() {
  const queryClient = useQueryClient();
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['groundhogs'],
    queryFn: fetchGroundhogPredictions,
    select: (data) => data.slice(0, 3),
    retry: false
  });

  if (isLoading) {
    return (
      <div className="text-center text-neutral-600 flex items-center justify-center gap-2">
        <svg className="animate-spin h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading predictions...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center space-y-4">
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">Failed to load predictions</h3>
          <p className="text-sm">{truncateError(error?.message)}</p>
        </div>
        <PurpleButton 
          onClick={() => queryClient.refetchQueries({ queryKey: ['groundhogs'] })}
          className="mx-auto"
        >
          Retry
        </PurpleButton>
      </div>
    );
  }

  // ... rest of the component remains the same ...
}

// Add this utility function at the bottom of the file
function truncateError(error?: string, maxLength = 200) {
  if (!error) return 'Unknown error occurred';
  return error.length > maxLength 
    ? `${error.substring(0, maxLength)}...` 
    : error;
}
