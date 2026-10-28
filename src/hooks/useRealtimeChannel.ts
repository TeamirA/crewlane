"use client";

import type { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabaseBrowserClient";
import type { RealtimeMessage } from "@/types/realtime";

export function useRealtimeChannel(
  topic: string | null,
  onMessage: (message: RealtimeMessage) => void,
): void {
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  });

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !topic) return;
    let channel: RealtimeChannel | null = null;
    let isCancelled = false;
    // Load our token before joining; otherwise the first join is sent with the anon key and denied.
    void supabase.realtime.setAuth().then(() => {
      if (isCancelled) return;
      channel = supabase
        .channel(topic, { config: { private: true } })
        .on("broadcast", { event: "*" }, ({ payload }) =>
          onMessageRef.current(payload as RealtimeMessage),
        )
        .subscribe((status, error) => {
          if (status === "CHANNEL_ERROR") console.warn(`Realtime channel ${topic} failed`, error);
        });
    });
    return () => {
      isCancelled = true;
      if (channel) void supabase.removeChannel(channel);
    };
  }, [topic]);
}
