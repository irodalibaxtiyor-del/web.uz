'use client';

import { ACTIVITY_IDLE_SECONDS, ACTIVITY_PING_SECONDS, type ActivityKind } from '@webdizayn/shared';
import { useEffect } from 'react';

const INPUT_EVENTS = ['pointerdown', 'pointermove', 'keydown', 'wheel', 'scroll', 'input'] as const;

/**
 * Measures active time on a learning page (time on task, for the research analytics): a second
 * counts only while the page is visible and the student did something in the last minute. The
 * total is sent every 30 s and when the page is hidden or left. The server caps what it
 * credits, so this is a measurement aid, not a trust boundary.
 */
export function useActivity(courseBase: string, kind: ActivityKind, targetId: string | null) {
  useEffect(() => {
    if (!targetId) return;
    let lastInput = Date.now();
    let pending = 0;
    const onInput = () => {
      lastInput = Date.now();
    };
    const flush = (keepalive = false) => {
      const seconds = Math.min(pending, ACTIVITY_PING_SECONDS);
      if (seconds < 1) return;
      pending -= seconds;
      void fetch(`/api${courseBase}/activity`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ kind, targetId, seconds }),
        credentials: 'same-origin',
        keepalive,
      }).catch(() => {
        // Offline or blocked: the time is simply not counted.
      });
    };
    const tick = window.setInterval(() => {
      const active =
        document.visibilityState === 'visible' &&
        Date.now() - lastInput < ACTIVITY_IDLE_SECONDS * 1000;
      if (active) pending += 1;
      if (pending >= ACTIVITY_PING_SECONDS) flush();
    }, 1000);
    const onHide = () => {
      if (document.visibilityState === 'hidden') flush(true);
    };
    for (const e of INPUT_EVENTS)
      window.addEventListener(e, onInput, { passive: true, capture: true });
    document.addEventListener('visibilitychange', onHide);
    return () => {
      window.clearInterval(tick);
      for (const e of INPUT_EVENTS) window.removeEventListener(e, onInput, { capture: true });
      document.removeEventListener('visibilitychange', onHide);
      flush(true);
    };
  }, [courseBase, kind, targetId]);
}
