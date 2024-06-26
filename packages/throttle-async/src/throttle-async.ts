import type { MonoTypeOperatorFunction } from "rxjs";
import { Observable, pipe } from "rxjs";
import { filter } from "rxjs/operators";

/**
 * This rxjs 6+ pipe emits one value and waits until another observable emits
 */
export function throttleAsync<T>(
  waitUntil$: Observable<any>,
): MonoTypeOperatorFunction<T> {
  // Flag whether the pipe is idle or blocked
  let isIdle = true;

  // Set isIdle to true when waitUntil$ emits
  waitUntil$.subscribe(() => (isIdle = true));

  // filterAsync(() => isIdle$, false),
  return pipe(
    filter(() => {
      if (isIdle) {
        // every time an event passes through, set isIdle to false
        isIdle = false;
        return true;
      }

      return false;
    }),
  );
}
