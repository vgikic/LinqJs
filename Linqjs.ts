
/**
 * Adds basic Linq functionality to javascript Array types.
 */
class LinqJs {

    constructor() {
        this.InitWhere();
        this.InitZip();
        this.InitFirst();
        this.InitLast();
        this.InitAggregate();
        this.InitMinBy();
        this.InitMaxBy();
        this.InitOrderBy();
        this.InitOrderByDesc();
        this.InitDistinct();
        this.InitAll();
        this.InitAny();
        this.InitUnion();
    }

    /**
    *   Helper function that returns property name of the property that contains variable passed in lambda function.  
    */
    private GetPropertyName = <T>(func: (value: T) => any, arrayElement: T) => {
        if (!(/\.([^\.;]+);?\s*\}$/.exec(func.toString()))) {
            throw `Function argument has to be lambda expression that returns property, e.g. for Id property it would look like this: x => x.Id `;
        }

        let propertyName = (/\.([^\.;]+);?\s*\}$/.exec(func.toString())[1]);

        if (!(propertyName in arrayElement)) {
            let properties = "";
            for (let prop in arrayElement) {
                properties += ` '${prop}'`
            }
            throw `Property ${propertyName} does not exist selected type.\n Properties in object are: ${properties}`;
        }

        return propertyName;
    };

    /**
    * Filters a sequence of values based on a predicate.
    */
    private InitWhere = () => {
        Array.prototype['where'] = function <T>(func: (value: T, index: number) => boolean): Array<T> | T[] {
            let inputArray = (this as Array<T>);
            let result = [];
            let sequanceLength = inputArray.length;

            for (let i = 0; i < sequanceLength; ++i) {
                if (func(inputArray[i], i)) {
                    result.push(inputArray[i]);
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
            let inputArray = (this as Array<TFirst>);
            let result: Array<TResult> = [];
            let firstSequanceLength = inputArray.length;
            let secondSequanceLength = sequance.length;

            for (let i = 0; i < firstSequanceLength && i < secondSequanceLength; ++i) {
                result.push(func(inputArray[i], sequance[i]));
            }
            return result;
        }
    };


    /**
    *  Returns the first element of a sequence.
    */
    private InitFirst = () => {
        Array.prototype['first'] = function <T>(func: (value: T) => boolean): T {
            let inputArray = (this as Array<T>);
            let result: T = null;
            let sequanceLength = inputArray.length;

            for (let i = 0; i < sequanceLength; ++i) {
                if (func(inputArray[i])) {
                    result = inputArray[i];
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
            let inputArray = (this as Array<T>);
            let result: T = null;
            let sequanceLength = inputArray.length;

            for (let i = sequanceLength - 1; i >= 0; --i) {
                if (func(inputArray[i])) {
                    result = inputArray[i];
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

    /**
    *   Determines object with the minimum value of specific property.
    */
    private InitMinBy = () => {
        let self = this;
        Array.prototype['minby'] = function <T>(func: (value: T) => any): T {
            let inputArray = (this as Array<T>);

            if (!inputArray || inputArray.length === 0)
                return null;

            let propertyName = self.GetPropertyName(func, inputArray[0]);

            let result: T = (inputArray) ? inputArray[0] : null;
            let sequanceLength = inputArray.length;

            for (let i = 1; i < sequanceLength; ++i) {
                if (result[propertyName] > inputArray[i][propertyName]) {
                    result = inputArray[i];
                }
            }
            return result;
        }
    };

    /**
    *   Determines object with the maximum value of specific property.
    */
    private InitMaxBy = () => {
        let self = this;
        Array.prototype['maxby'] = function <T>(func: (value: T) => any): T {
            let inputArray = (this as Array<T>);

            if (!inputArray || inputArray.length === 0)
                return null;

            let propertyName = self.GetPropertyName(func, inputArray[0]);

            let result: T = (inputArray) ? inputArray[0] : null;
            let sequanceLength = inputArray.length;

            for (let i = 1; i < sequanceLength; ++i) {
                if (result[propertyName] < inputArray[i][propertyName]) {
                    result = inputArray[i];
                }
            }
            return result;
        }
    };

    /**
    *  Sorts the elements of a sequence in ascending order according to a key.
    */
    private InitOrderBy = () => {
        let self = this;
        Array.prototype['orderby'] = function <T>(func: (value: T) => any): Array<T> {

            let inputArray = (this as Array<T>);

            if (!inputArray || inputArray.length === 0)
                return null;

            let propertyName = self.GetPropertyName(func, inputArray[0]);

            let sortedArray = inputArray.sort((first, second) => {
                if (first[propertyName] < second[propertyName])
                    return -1;
                else if (first[propertyName] > second[propertyName])
                    return 1;
                else
                    return 0;
            });

            return sortedArray;
        }
    };

    /**
    *  Sorts the elements of a sequence in descending order according to a key.
    */
    private InitOrderByDesc = () => {
        let self = this;
        Array.prototype['orderbydesc'] = function <T>(func: (value: T) => any): Array<T> {

            let inputArray = (this as Array<T>);

            if (!inputArray || inputArray.length === 0)
                return null;

            let propertyName = self.GetPropertyName(func, inputArray[0]);

            let sortedArray = inputArray.sort((first, second) => {
                if (first[propertyName] < second[propertyName])
                    return 1;
                else if (first[propertyName] > second[propertyName])
                    return -1;
                else
                    return 0;
            });

            return sortedArray;
        }
    };

    /**
    *  Returns distinct elements from a sequence or sequences compared by value of each property.
    * @param rest N * comma separated Array<T> (optional)
    */
    private InitDistinct = () => {
        Array.prototype['distinct'] = function <T>(...rest: Array<Array<T>>): Array<T> {
            let firstArray = (this as Array<T>);

            if (!firstArray || !rest || (firstArray.length === 0 && rest.length === 0))
                return null;

            let combinedSequance: Array<T> = firstArray.concat([]);

            for (let i = 0; i < rest.length; ++i) {
                if (rest[i]) {
                    combinedSequance = combinedSequance.concat(rest[i]);
                }
            }

            let result: Array<T> = [combinedSequance[0]];
            let properties = Object.keys(combinedSequance[0]);
            let combinedSequanceLength = combinedSequance.length;

            for (let i = 1; i < combinedSequanceLength; ++i) {
                let propsWithSameValueCounter = 0;

                for (let j = 0; j < result.length; ++j) {
                    propsWithSameValueCounter = 0;

                    for (let propertyIndex = 0; propertyIndex < properties.length; ++propertyIndex) {

                        if (result[j][properties[propertyIndex]] === combinedSequance[i][properties[propertyIndex]]) {
                            ++propsWithSameValueCounter;
                        }
                        else break;
                    }

                    if (propsWithSameValueCounter === properties.length) break;
                }
                if (propsWithSameValueCounter < properties.length)
                    result.push(combinedSequance[i]);
            }
            return result;
        };
    }

    /**
    *  Determines whether all elements of a sequence satisfy a condition.
    */
    private InitAll = () => {
        Array.prototype['all'] = function <T>(func: (value: T) => boolean): boolean {
            let inputArray = (this as Array<T>);
            return inputArray.every(func);
        }
    };

    /**
    *  Determines whether any element of a sequence satisfies a condition.
    */
    private InitAny = () => {
        Array.prototype['any'] = function <T>(func: (value: T) => boolean): boolean {
            let inputArray = (this as Array<T>);
            return inputArray.some(func);
        }
    };

    /**
    *  Produces the set union of two or more sequences.
    *  If you want grouped distinct elements from multiple arrays use 'distinct' instead.
    */
    private InitUnion = () => {
        Array.prototype['union'] = function <T>(...rest: Array<Array<T>>): Array<T> {
            let inputArray = (this as Array<T>);

            let combinedSequance: Array<T> = inputArray;

            for (let i = 0; i < rest.length; ++i) {
                if (rest[i]) {
                    combinedSequance = combinedSequance.concat(rest[i]);
                }
            }
            return combinedSequance;
        }
    };
}

export = new LinqJs();