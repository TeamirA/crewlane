"use client";

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
    const channel = supabase
      .channel(topic, { config: { private: true } })
      .on("broadcast", { event: "*" }, ({ payload }) =>
        onMessageRef.current(payload as RealtimeMessage),
      )
      .subscribe((status, error) => {
        if (status === "CHANNEL_ERROR") console.warn(`Realtime channel ${topic} failed`, error);
      });
    return () => {
      supabase.removeChannel(channel);
    };
  }, [topic]);
}
