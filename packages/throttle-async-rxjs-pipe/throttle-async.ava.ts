import test from 'ava';
import {clear} from 'console';
import {EMPTY, interval, of, TimeoutError} from 'rxjs';
import {catchError, map, take, tap, timeout} from 'rxjs/operators';
import {throttleAsync} from './throttle-async';

/**
 * Throttle Async Pipe (Source Interval 500)
 * Without any waitUntil$ emission
 * Should emit first element and wait 'indefinitely'
 * (test waits for 3000 ms)
 */
test.serial(`ThrottleAsync Pipe should emit first event`, t => {
	const waitUntil$ = EMPTY;
	let eventCount = 0;
	let absoluteTime = 0;

	return interval(500).pipe(
		tap(() => {
			absoluteTime += 500;
			console.log(`Time Passed: ${absoluteTime}`);
		}),
		throttleAsync(waitUntil$),
		tap(() => {
			eventCount++;
			console.log(`Emit after ThrottleAsync: ${absoluteTime}`);
		}),
		timeout(2000),
		catchError(error => {
			console.log(`TimeoutEvent: ${error.message}`);
			t.true(error instanceof TimeoutError);
			t.is(eventCount, 1);
			clear;
			return of('timeout');
		})
	);
});

/**
 * Throttle Async Pipe (Source Interval 500)
 * With one waitUntil$ emission after 2 sek
 * Should have emitted two elements after 3 sek
 */
test.serial(`ThrottelAsync Pipe should emit next event after waitObservable$ emitted`, t => {
	const waitUntil$ = interval(2000).pipe(
		take(1),
		tap(() => console.log('Observable waitUntil$ emitted!'))
	);
	let eventCount = 0;
	let absoluteTime = 0;

	return interval(500).pipe(
		tap(() => {
			absoluteTime += 500;
			console.log(`Time Passed: ${absoluteTime}`);
		}),
		throttleAsync(waitUntil$),
		tap(() => {
			eventCount++;
			console.log(`Emit after ThrottleAsync: ${absoluteTime}`);
		}),
		timeout(3000),
		catchError(error => {
			console.log(`TimeoutEvent: ${error.message}`);
			t.true(error instanceof TimeoutError);
			t.is(eventCount, 2);
			clear;
			return of('timeout');
		})
	);
});
