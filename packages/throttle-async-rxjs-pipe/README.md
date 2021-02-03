# throttle-async-rxjs-pipe

A pipe functions for rxjs 6+ which accepts a 'wait' observable, emits 1 elements of the source stream
and waits for an event on the 'wait' observable.

## What does throttleAsync do (in order)?

1. Get a waitUntil\$ observable as parameter
2. Emit one value (may be configurable in the future)
3. Wait until waitUntil\$ observable emits a value.
4. If waitUntil\$ emits a value, emit another value from the source observable.

## Why is this useful?

I personally need it for splitting up resize events from the browser into a
`resize-start` and a `resize-end` observable.

First, we need an observable of window resize events:

    const windowResize$ = fromEvent(window, 'resize');

We can produce a `resize-end` observable by

    const windowResizeEnd$ = windowResize$.pipe(debounceTime(500));

But how would you build the windowResizeStart\$ observable?
This is, where the `throttleAsync` pipe comes in.  
We need `windowResize$` to emit exactly one event and then pause emission  
until `windowResizeEnd$` emits a value.

        const windowResizeStart$ = windowResize$.pipe(
            throttleAsync(windowResizeEnd$)
        );

## Future Features (eventually)

- Emit `n source events` between `waitUntil$` observable emissions instead of only one.  
  The parameter n should be configureable when instantiating throttleAsync.
- Make the parameter n dynamic by using the value of the `waitUntil$` observable
  as a number of how many events to emit next.
- Add https://github.com/xripcsu/rxjs-watcher to help visualize the function of these operators

## Tooling

- [Pika Pack TS Compile](https://www.npmjs.com/package/@pika/plugin-ts-standard-pkg)

## Changelog

## [1.2.0] - WIP

- Switched to @pika/pack for building the library, which unlocks lot more formats for consuming the library:
  - dist-src (ES2020, ESM)
  - dist-node (ES2020, Require)
  - dist-types (Typescript Typings)
  - dist-web (ES2020, Inline ESM)
  - dist-deno (Typescript Source)

## [1.1.0] - 2020-04-13

- Updated Dependencies to fix dependency security issues
- Improved npm packaging for easier usage

### [1.0.0] - 2018-11-12

_Initial Release_

#### Features

- throttleAsync pipe which emits one event and then waits for `waitUntil$` observable emissions
