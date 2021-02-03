import {EMPTY, interval, of, TimeoutError} from 'rxjs';
import {catchError, take, timeout} from 'rxjs/operators';
import {throttleAsync} from './throttle-async';

describe('Throttle Async Pipe (Source Interval 500)', () => {
	describe('Without any waitUntil$ emission', () => {
		it('Should emit first element', done => {
			const waitObservable = EMPTY;
			let eventCount = 0;

			const subscription = interval(500)
				.pipe(
					throttleAsync(waitObservable),
					timeout(1500),
					catchError(error => {
						expect(error).toBeInstanceOf(TimeoutError);
						return of('timeout');
					})
				)
				.subscribe(data => {
					if (data === 'timeout') {
						expect(eventCount).toBe(1);
						subscription.unsubscribe();
						done();
					}
				});
		});
	});

	describe('With one waitUntil$ emission after 2 sek', function () {
		it('Should have emitted two elements after 3 sek', done => {
			let eventCount = 0;
			const waitUntil$ = interval(1500).pipe(take(1));

			const subscription = interval(500)
				.pipe(
					throttleAsync(waitUntil$),
					timeout(3000),
					catchError(error => {
						expect(error).toBeInstanceOf(TimeoutError);
						return of('timeout');
					})
				)
				.subscribe(data => {
					if (data === 'timeout') {
						expect(eventCount).toBe(2);
						subscription.unsubscribe();
						done();
					}
				});
		});
	});
});
