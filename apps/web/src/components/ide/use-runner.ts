'use client';

import type { ProjectFile } from '@webdizayn/shared';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  MAX_CONSOLE_LINES,
  parseRunnerMessage,
  RUN_TIMEOUT_MS,
  type ConsoleLine,
  type RunMessage,
} from '@/lib/sandbox';

export type RunStatus = 'idle' | 'running' | 'ok' | 'timeout';

/**
 * Drives the sandbox runner iframe: queues RUN until the runner says it is ready,
 * accepts messages only from that iframe's window, and recreates the iframe if a run
 * does not finish loading within RUN_TIMEOUT_MS (watchdog).
 */
export function useRunner() {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const readyRef = useRef(false);
  const pendingRef = useRef<RunMessage | null>(null);
  const runIdRef = useRef('');
  const watchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [frameKey, setFrameKey] = useState(0);
  const [status, setStatus] = useState<RunStatus>('idle');
  const [lines, setLines] = useState<ConsoleLine[]>([]);

  const post = useCallback((msg: RunMessage) => {
    // The runner has an opaque origin (sandboxed iframe), so '*' is the only usable
    // target; delivery is still pinned to this specific iframe window.
    frameRef.current?.contentWindow?.postMessage(msg, '*');
  }, []);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (!frameRef.current || event.source !== frameRef.current.contentWindow) return;
      const msg = parseRunnerMessage(event.data);
      if (!msg) return;
      if (msg.type === 'wd:ready') {
        readyRef.current = true;
        if (pendingRef.current) {
          post(pendingRef.current);
          pendingRef.current = null;
        }
        return;
      }
      if (msg.runId !== runIdRef.current) return;
      if (msg.type === 'wd:loaded') {
        if (watchdogRef.current) clearTimeout(watchdogRef.current);
        setStatus('ok');
      } else {
        setLines((prev) =>
          prev.length >= MAX_CONSOLE_LINES ? prev : [...prev, { level: msg.level, text: msg.text }],
        );
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [post]);

  useEffect(
    () => () => {
      if (watchdogRef.current) clearTimeout(watchdogRef.current);
    },
    [],
  );

  const run = useCallback(
    (files: ProjectFile[]) => {
      const runId = crypto.randomUUID();
      runIdRef.current = runId;
      setLines([]);
      setStatus('running');
      const msg: RunMessage = { type: 'wd:run', runId, files };
      if (readyRef.current) post(msg);
      else pendingRef.current = msg;

      if (watchdogRef.current) clearTimeout(watchdogRef.current);
      watchdogRef.current = setTimeout(() => {
        if (runIdRef.current !== runId) return;
        setStatus('timeout');
        // Throw the frame (and any runaway script in it) away; a fresh runner loads.
        readyRef.current = false;
        pendingRef.current = null;
        setFrameKey((k) => k + 1);
      }, RUN_TIMEOUT_MS);
    },
    [post],
  );

  const clearConsole = useCallback(() => setLines([]), []);

  return { frameRef, frameKey, status, lines, run, clearConsole };
}
