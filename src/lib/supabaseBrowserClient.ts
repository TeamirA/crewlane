"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { apiRequest } from "./httpClient";

const TOKEN_REFRESH_MARGIN_MS = 60_000;

let browserClient: SupabaseClient | null = null;
let cachedToken: { token: string; expiresAt: number } | null = null;

// Realtime authenticates with short-lived tokens minted by our own API, never Supabase Auth.
async function getRealtimeToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt - Date.now() > TOKEN_REFRESH_MARGIN_MS) {
    return cachedToken.token;
  }
  const { token, expiresAt } = await apiRequest<{ token: string; expiresAt: string }>(
    "/api/realtime/token",
  );
  cachedToken = { token, expiresAt: new Date(expiresAt).getTime() };
  return token;
}

export function getSupabaseBrowserClient(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) {
    return null;
  }
  browserClient ??= createClient(supabaseUrl, anonKey, { accessToken: getRealtimeToken });
  return browserClient;
}

export function clearRealtimeSession(): void {
  cachedToken = null;
  browserClient?.removeAllChannels();
}
