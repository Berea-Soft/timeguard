/**
 * Regression tests for useTimeGuard()'s reactivity across framework
 * wrappers, using the REAL Vue package rather than a hand-rolled mock —
 * a hand-rolled `watch` mock can't prove real dependency tracking
 * actually works, which is exactly what this bug was about (see
 * BACKLOG.md "useTimeGuard() no reactivo a cambios de input").
 *
 * Solid's equivalent fix isn't covered here: solid-js resolves to its
 * server/SSR build under Node (createEffect() is an intentional no-op
 * stub there), and vitest's SSR module pipeline doesn't honor a plain
 * resolve.conditions override the way a standalone Node script does —
 * reaching Solid's real client reactivity would need deeper Vite SSR
 * config work. That fix was verified manually instead (node
 * --conditions=browser against a real createRoot/createSignal), and the
 * Qwik equivalent (isSignal + track()) follows the same textbook Qwik
 * pattern its own useCurrentTime already uses, but wasn't independently
 * runtime-tested (needs a full component container).
 */
import { describe, it, expect } from 'vitest';
import { ref, nextTick } from 'vue';
import { useTimeGuard as useVueTimeGuard } from '../src/vue';

describe('useTimeGuard() reactivity', () => {
  it('Vue: updates when the input Ref changes', async () => {
    const dateStr = ref('2026-01-01');
    const tg = useVueTimeGuard(dateStr);
    expect(tg.value.format('YYYY-MM-DD')).toBe('2026-01-01');

    dateStr.value = '2026-12-25';
    await nextTick();
    expect(tg.value.format('YYYY-MM-DD')).toBe('2026-12-25');
  });

  it('Vue: a plain (non-Ref) input is read once and does not update on its own', async () => {
    const tg = useVueTimeGuard('2026-01-01');
    expect(tg.value.format('YYYY-MM-DD')).toBe('2026-01-01');
    await nextTick();
    expect(tg.value.format('YYYY-MM-DD')).toBe('2026-01-01');
  });
});
