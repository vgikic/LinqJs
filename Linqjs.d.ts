interface Array<T> {
    /**
    * Filters a sequence of values based on a predicate.
    */
    where(func: (value: T, index: number) => boolean): Array<T> | T[];

    /**
    * Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
    */
    zip<TSecond, TResult>(sequance: Array<TSecond>, func: (first: T, second: TSecond) => TResult): Array<TResult> | TResult[];


    /**
    *  Returns the first element of a sequence.
    */
    first(func: (value: T) => boolean): T;

    /**
    *  Returns the last element of a sequence.
    */
    last(func: (value: T) => boolean): T;

    /**
    *  Applies an accumulator function over a sequence.
    */
    aggregate(func: (previous: T, current: T, currentIndex: number, array: Array<T>) => T): T;

    /**
     *  Determines the minimum value of specific property.
    */
    minby(property: string): T;

    /**
    *  Determines the maximum value of specific property.
    */
    maxby(property: string): T;
   
}
