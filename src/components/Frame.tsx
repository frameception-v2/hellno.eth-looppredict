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

// ... rest of the file remains unchanged ...
