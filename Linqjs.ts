
/**
 * Adds basic Linq functionality to javascript Array types.
 */
class LinqJs {

    constructor() {
        this.InitWhere();
        this.InitZip();
        this.InitFirst();
        this.InitLast();
    }

    /**
    * Filters a sequence of values based on a predicate.
    */
    private InitWhere = () => {
        Array.prototype['where'] = function <T>(func: (value: T, index: number) => boolean): Array<T> | T[] {
            let result = [];
            let sequanceLength = this.length;

            for (let i = 0; i < sequanceLength; ++i) {
                if (func(this[i], i)) {
                    result.push(this[i]);
                }
            }
            return result;
        }
    };


    /**
    * Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
    */
    private InitZip = () => {
        Array.prototype['zip'] = function <TFirst, TSecond, TResult>(sequance: Array<TSecond>, func: (first: TFirst, second: TSecond) => TResult): Array<TResult> | TResult[] {
            let result: Array<TResult> = [];
            let firstSequanceLength = this.length;
            let secondSequanceLength = sequance.length;

            for (let i = 0; i < firstSequanceLength && i < secondSequanceLength; ++i) {
                result.push(func(this[i], sequance[i]));
            }
            return result;
        }
    };


    /**
    *  Returns the first element of a sequence.
    */
    private InitFirst = () => {
        Array.prototype['first'] = function <T>(func: (value: T) => boolean): T {
            let result: T = null;
            let sequanceLength = this.length;

            for (let i = 0; i < sequanceLength; ++i) {
                if (func(this[i])) {
                    result = this[i];
                    break;
                }
            }
            return result;
        }
    };

    /**
    *  Returns the last element of a sequence.
    */
    private InitLast = () => {
        Array.prototype['last'] = function <T>(func: (value: T) => boolean): T {
            let result: T = null;
            let sequanceLength = this.length;

            for (let i = sequanceLength - 1; i >= 0; --i) {
                if (func(this[i])) {
                    result = this[i];
                    break;
                }
            }
            return result;
        }
    };

    /**
   *  Applies an accumulator function over a sequence.
   */
    private InitAggregate = () => {
        Array.prototype['aggregate'] = function <T>(func: (previous: T, current: T, currentIndex: number, array: Array<T>) => T): T {
            return (this as Array<T>).reduce(func);
        }
    };

}

export = new LinqJs();