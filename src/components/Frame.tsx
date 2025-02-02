"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, {
  AddFrame,
  SignIn as SignInCore,
  type Context,
} from "@farcaster/frame-sdk";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { config } from "~/components/providers/WagmiProvider";
import { PurpleButton } from "~/components/ui/PurpleButton";
import { truncateAddress } from "~/lib/truncateAddress";
import { base, optimism } from "wagmi/chains";
import { useSession } from "next-auth/react";
import { createStore } from "mipd";
import { Label } from "~/components/ui/label";
import { PROJECT_TITLE, GROUNDHOG_API_BASE } from "~/lib/constants";

interface Prediction {
  year: number;
  prediction: string;
  date: string;
}

interface Groundhog {
  name: string;
  slug: string;
  region: string;
  predictions: Prediction[];
}

const queryClient = new QueryClient();

function GroundhogPredictions() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['groundhogs'],
    queryFn: fetchGroundhogPredictions,
    select: (data) => data.slice(0, 3), // Show top 3 groundhogs
  });

  if (isLoading) {
    return (
      <div className="text-center text-neutral-600">
        Loading predictions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Failed to load predictions
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data?.map((groundhog) => (
        <PredictionCard key={groundhog.slug} groundhog={groundhog} />
      ))}
    </div>
  );
}

async function fetchGroundhogPredictions() {
  const response = await fetch(`${GROUNDHOG_API_BASE}/groundhogs`);
  if (!response.ok) {
    throw new Error('Failed to fetch predictions');
  }
  return response.json() as Promise<Groundhog[]>;
}

function PredictionCard({ groundhog }: { groundhog: Groundhog }) {
  const latestPrediction = groundhog.predictions[0];
  
  return (
    <Card className="border-neutral-200 bg-white mb-4">
      <CardHeader>
        <CardTitle className="text-neutral-900">{groundhog.name}</CardTitle>
        <CardDescription className="text-neutral-600">
          {groundhog.region}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-neutral-800">
        {latestPrediction ? (
          <div>
            <p className="font-bold">Latest Prediction ({latestPrediction.year}):</p>
            <p>{latestPrediction.prediction}</p>
          </div>
        ) : (
          <p>No predictions available</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function Frame({
  title = PROJECT_TITLE,
}: {
  title?: string;
} = {}) {
  return (
    <QueryClientProvider client={queryClient}>
      <FrameContent title={title} />
    </QueryClientProvider>
  );
}

function FrameContent(
  { title }: { title?: string } = { title: PROJECT_TITLE }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();

  const [added, setAdded] = useState(false);

  const [addFrameResult, setAddFrameResult] = useState("");

  const addFrame = useCallback(async () => {
    try {
      await sdk.actions.addFrame();
    } catch (error) {
      if (error instanceof AddFrame.RejectedByUser) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      if (error instanceof AddFrame.InvalidDomainManifest) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      setAddFrameResult(`Error: ${error}`);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      if (!context) {
        return;
      }

      setContext(context);
      setAdded(context.client.added);

      // If frame isn't already added, prompt user to add it
      if (!context.client.added) {
        addFrame();
      }

      sdk.on("frameAdded", ({ notificationDetails }) => {
        setAdded(true);
      });

      sdk.on("frameAddRejected", ({ reason }) => {
        console.log("frameAddRejected", reason);
      });

      sdk.on("frameRemoved", () => {
        console.log("frameRemoved");
        setAdded(false);
      });

      sdk.on("notificationsEnabled", ({ notificationDetails }) => {
        console.log("notificationsEnabled", notificationDetails);
      });
      sdk.on("notificationsDisabled", () => {
        console.log("notificationsDisabled");
      });

      sdk.on("primaryButtonClicked", () => {
        console.log("primaryButtonClicked");
      });

      console.log("Calling ready");
      sdk.actions.ready({});

      // Set up a MIPD Store, and request Providers.
      const store = createStore();

      // Subscribe to the MIPD Store.
      store.subscribe((providerDetails) => {
        console.log("PROVIDER DETAILS", providerDetails);
        // => [EIP6963ProviderDetail, EIP6963ProviderDetail, ...]
      });
    };
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded, addFrame]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="w-[300px] mx-auto py-2 px-2">
        <h1 className="text-2xl font-bold text-center mb-4 text-neutral-900">{title}</h1>
        
        <GroundhogPredictions />
      </div>
    </div>
  );
}
