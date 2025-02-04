"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, {
  AddFrame,
  SignIn as SignInCore,
  type Context,
} from "@farcaster/frame-sdk";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { useQuery, QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { PurpleButton } from "~/components/ui/PurpleButton";

// Proper default export component
export default function Frame() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<sdk.Context>();
  const queryClient = useQueryClient();

  useEffect(() => {
    const initializeSDK = async () => {
      setContext(await sdk.context);
      sdk.actions.ready();
      setIsSDKLoaded(true);
    };
    
    if (sdk && !isSDKLoaded) {
      initializeSDK();
    }
  }, [isSDKLoaded]);

  if (!isSDKLoaded) return <div>Loading...</div>;

  return (
    <QueryClientProvider client={queryClient}>
      <Card className="w-[300px] mx-auto my-4">
        <CardHeader>
          <CardTitle>Prediction Frame</CardTitle>
          <CardDescription>Interactive weather predictions</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Frame content implementation */}
        </CardContent>
      </Card>
    </QueryClientProvider>
  );
}
