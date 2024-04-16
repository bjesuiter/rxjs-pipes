import { expect, test } from "bun:test";
import {
  EMPTY,
  firstValueFrom,
  interval,
  lastValueFrom,
  of,
  TimeoutError,
} from "rxjs";
import { catchError, map, take, tap, timeout } from "rxjs/operators";
import { throttleAsync } from "./throttle-async";

/**
 * Throttle Async Pipe (Source Interval 500)
 * Without any waitUntil$ emission
 * Should emit first element and wait 'indefinitely'
 * (test waits for 3000 ms)
 */
test(
  `ThrottleAsync: emits one event and no more, because it waits for waitUntil$ to emit`,
  () => {
    const waitUntil$ = EMPTY;
    let eventCount = 0;
    let absoluteTime = 0;

    const testpipe = interval(500).pipe(
      tap(() => {
        absoluteTime += 500;
        console.log(`interval(500): Time Passed: ${absoluteTime}`);
      }),
      throttleAsync(waitUntil$),
      tap(() => {
        eventCount++;
        console.log(`testpipe: Emits after ThrottleAsync: ${absoluteTime}`);
      }),
      timeout(1500),
      catchError((error) => {
        console.log(`TimeoutEvent: ${error.message}`);
        expect(error).toBeInstanceOf(TimeoutError);
        expect(eventCount).toBe(1);

        // this last emission is necessary to prevent the test from hanging
        // it is used with take(2) to complete the testpipe for lastValueFrom to resolve
        return of("timeout");
      }),
    );

    return lastValueFrom(testpipe.pipe(take(2)));
  },
  3000,
);

/**
 * Throttle Async Pipe (Source Interval 500)
 * With one waitUntil$ emission after 2 sek
 * Should have emitted two elements after 3 sek
 *
 * Emission Diagram:
 * 500ms: interval(500) emits 1, testpipe emits
 * 1000ms: interval(500) emits 2, but testpipe with throttleAsync waits for waitUntil$ to emit
 * 1500ms: interval(500) emits 3, but ttestpipe with hrottleAsync waits for waitUntil$ to emit
 * 2000ms: interval(500) emits 4, waitUntil$ emits, testpipe with throttleAsync emits
 */

test(`ThrottleAsync: emits two events after waitUntil$ emits`, () => {
  const waitUntil$ = interval(2000).pipe(
    take(1),
    tap(() => console.log("waitUntil$: emits one event and completes")),
  );
  let eventCount = 0;
  let absoluteTime = 0;

  const testpipe = interval(500).pipe(
    tap(() => {
      absoluteTime += 500;
      // console.log(`interval(500): Time Passed: ${absoluteTime}`);
    }),
    throttleAsync(waitUntil$),
    tap(() => {
      eventCount++;
      console.log(`testpipe: Emits after ThrottleAsync: ${absoluteTime}`);
    }),
    timeout(3000),
    catchError((error) => {
      // THIS SHOULD HAPPEN IN THIS TEST!
      console.log(`TimeoutEvent: ${error.message}`);
      expect(error).toBeInstanceOf(TimeoutError);
      expect(eventCount).toBe(2);
      return of("timeout");
    }),
  );

  return lastValueFrom(testpipe.pipe(take(2)));
});
