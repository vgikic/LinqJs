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
     *  Determines the minimum value from collection of elements.
    */
    min(func: (value: T) => any): T;

    /**
    *  Determines the maximum value from collection of elements.
    */
    max(func: (value: T) => any): T;

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

    /**
    *  Determines whether all elements of a sequence satisfy a condition.
    */
    all(func: (value: T) => boolean): boolean;

    /**
    *  Determines whether any element of a sequence satisfies a condition.
    */
    any(func: (value: T) => boolean): boolean;

    /**
    *  Produces the set union of two or more sequences.
    *  If you want grouped distinct elements from multiple arrays use 'distinct' instead.
    */
    union(...rest: Array<Array<T>>): Array<T>;

    /**
    *  Projects each element of a sequence into a new form.
    * @param func A transform function to apply to each element.
    */
    select(func: (value: T, index?: number) => any): Array<T>;

    /**
    *  Produces the set intersection of two sequences by value of each property.
    */
    intersect(secondSequance: Array<T>): Array<T>;

    /**
    *  Produces the subset of elements of input sequance that dont exist in second sequance.
    */
    except(secondSequance: Array<T>): Array<T>;

}
