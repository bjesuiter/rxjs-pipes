import { expect, test } from "bun:test";
import { EMPTY, firstValueFrom, interval, of, TimeoutError } from "rxjs";
import { catchError, map, take, tap, timeout } from "rxjs/operators";
import { throttleAsync } from "./throttle-async";

test(
  `ThrottleAsync: emits one event and no more, because it waits for waitUntil$ to emit`,
  () => {
    const waitUntil$ = EMPTY;
    let eventCount = 0;
    let absoluteTime = 0;

    const testpipe = interval(500).pipe(
      tap(() => {
        absoluteTime += 500;
        console.log(`Time Passed: ${absoluteTime}`);
      }),
      throttleAsync(waitUntil$),
      tap(() => {
        eventCount++;
        console.log(`Emit after ThrottleAsync: ${absoluteTime}`);
      }),
      timeout(5000),
      catchError((error) => {
        // THIS CANNOT HAPPEN IN THIS TEST!
        console.log(`TimeoutEvent: ${error.message}`);
        expect(error).toBeInstanceOf(TimeoutError);
        expect(eventCount).toBe(1);
        console.clear();
        return EMPTY;
      }),
    );

    return firstValueFrom(testpipe);
  },
  6000,
);
