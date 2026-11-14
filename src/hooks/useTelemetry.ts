import { useCallback, useEffect, useRef, useState } from "react";
import {
  demoReading,
  isStale,
  parseTelemetry,
  type TelemetryReading,
} from "../lib/telemetry";

export function useTelemetry() {
  const endpoint = import.meta.env.VITE_TELEMETRY_URL?.trim();
  const [reading, setReading] = useState<TelemetryReading | null>(
    endpoint ? null : demoReading,
  );
  const [loading, setLoading] = useState(Boolean(endpoint));
  const [error, setError] = useState<string | null>(null);
  const [clock, setClock] = useState(Date.now());
  const [revision, setRevision] = useState(0);
  const current = useRef<AbortController | null>(null);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    if (!endpoint) return;
    let alive = true;
    const update = async () => {
      if (document.hidden) return;
      current.current?.abort();
      const controller = new AbortController();
      current.current = controller;
      const timeout = window.setTimeout(() => controller.abort(), 10000);
      setLoading(true);
      try {
        const response = await fetch(endpoint, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = parseTelemetry(await response.json());
        if (alive && current.current === controller) {
          setReading(result);
          setError(null);
          setClock(Date.now());
        }
      } catch {
        if (alive && current.current === controller)
          setError(
            "Telemetry could not be refreshed. Check the connection and try again.",
          );
      } finally {
        clearTimeout(timeout);
        if (alive && current.current === controller) setLoading(false);
      }
    };
    void update();
    const interval = window.setInterval(() => void update(), 60000);
    const visibility = () => {
      if (!document.hidden) void update();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      alive = false;
      clearInterval(interval);
      current.current?.abort();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [endpoint, revision]);

  useEffect(() => {
    const interval = window.setInterval(() => setClock(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    reading,
    loading,
    error,
    refresh,
    isDemo: !endpoint,
    stale: reading ? isStale(reading, clock) : false,
  };
}
