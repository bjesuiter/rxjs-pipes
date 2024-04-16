# filter-async-rxjs-pipe

Some pipeable functions for rxjs 7+ which accept predicate lambdas with async return value (Promise or Observable).

BREAKING CHANGE from ^2.0.0: This library now requires rxjs 7.0.0 or higher!

## Usage

See [filter-async.test.ts](https://github.com/bjesuiter/rxjs-pipes/blob/main/packages/filter-async/src/filter-async.test.ts)
in [Github](https://github.com/bjesuiter/rxjs-pipes/tree/main/packages/filter-async) for usage examples.

##  Provided rxjs 7+ pipes

### filterByPromise
This rxjs 7+ pipe accepts a predicate function which returns a `Thenable<boolean>` for filtering.  
(e.g. any object with a 'then' method === Promise and custom promise implementations)

### filterAsync
This rxjs 7+ pipe accepts a predicate function which returns an `Observable<boolean>` for filtering.

### Note
Both of these functions have a `parallel` flag to indicate, 
that they should run the predicate function in parallel for each emitted event from the source observable.
However, this does not work currently and should be improved in a later release. 