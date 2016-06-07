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

    /**
    *  Sorts the elements of a sequence in ascending order according to a key.
    */
    orderby(func: (value: T) => any): Array<T>;

    /**
    *  Sorts the elements of a sequence in descending order according to a key.
    */
    orderbydesc(func: (value: T) => any): Array<T>;

    /**
    *  Returns distinct elements from a sequence or sequences compared by value of each property.
    * @param rest N * comma separated Array<T> (optional)
    */
    distinct(...rest: Array<Array<T>>): Array<T>;
}
