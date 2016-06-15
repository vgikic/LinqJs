
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
        this.InitMin();
        this.InitMax();
        this.InitOrderBy();
        this.InitOrderByDesc();
        this.InitDistinct();
        this.InitAll();
        this.InitAny();
        this.InitUnion();
        this.InitSelect();
        this.InitIntersect();
        this.InitExcept();
        this.InitSkip();
        this.InitSkipWhile();
        this.InitTake();
        this.InitTakeWhile();
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
    *   Determines the minimum value from collection of elements.
    */
    private InitMin = () => {
        let self = this;
        Array.prototype['min'] = function <T>(func: (value: T) => any): T {
            let inputArray = (this as Array<T>);

            if (!inputArray || inputArray.length === 0)
                return null;

            let sortedArray;
            let propertyName = ""

            if (Object.keys(inputArray[0]).length > 0)
                propertyName = self.GetPropertyName(func, inputArray[0]);

            let result: T = (inputArray) ? inputArray[0] : null;
            let sequanceLength = inputArray.length;

            if (propertyName) {
                for (let i = 1; i < sequanceLength; ++i) {
                    if (result[propertyName] > inputArray[i][propertyName]) {
                        result = inputArray[i];
                    }
                }
            } else {
                for (let i = 1; i < sequanceLength; ++i) {
                    if (result > inputArray[i]) {
                        result = inputArray[i];
                    }
                }
            }
            return result;
        }
    };

    /**
    *   Determines the maximum value from collection of elements.
    */
    private InitMax = () => {
        let self = this;
        Array.prototype['max'] = function <T>(func: (value: T) => any): T {
            let inputArray = (this as Array<T>);

            if (!inputArray || inputArray.length === 0)
                return null;

            let sortedArray;
            let propertyName = ""

            if (Object.keys(inputArray[0]).length > 0)
                propertyName = self.GetPropertyName(func, inputArray[0]);

            let result: T = (inputArray) ? inputArray[0] : null;
            let sequanceLength = inputArray.length;

            if (propertyName) {
                for (let i = 1; i < sequanceLength; ++i) {
                    if (result[propertyName] < inputArray[i][propertyName]) {
                        result = inputArray[i];
                    }
                }
            } else {
                for (let i = 1; i < sequanceLength; ++i) {
                    if (result < inputArray[i]) {
                        result = inputArray[i];
                    }
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

            let sortedArray;
            let propertyName = ""

            if (Object.keys(inputArray[0]).length > 0)
                propertyName = self.GetPropertyName(func, inputArray[0]);

            if (propertyName) {
                sortedArray = inputArray.sort((first, second) => {
                    if (first[propertyName] < second[propertyName])
                        return -1;
                    else if (first[propertyName] > second[propertyName])
                        return 1;
                    else
                        return 0;
                });
            }
            else {
                sortedArray = inputArray.sort((first, second) => {
                    if (first < second)
                        return -1;
                    else if (first > second)
                        return 1;
                    else
                        return 0;
                });
            }
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

            let sortedArray;
            let propertyName = "";
            if (Object.keys(inputArray[0]).length > 0)
                propertyName = self.GetPropertyName(func, inputArray[0]);

            if (propertyName) {
                sortedArray = inputArray.sort((first, second) => {
                    if (first[propertyName] < second[propertyName])
                        return 1;
                    else if (first[propertyName] > second[propertyName])
                        return -1;
                    else
                        return 0;
                });
            }
            else {
                sortedArray = inputArray.sort((first, second) => {
                    if (first < second)
                        return 1;
                    else if (first > second)
                        return -1;
                    else
                        return 0;
                });

            }
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

            if (properties.length > 0) {
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
            }
            else {
                for (let i = 0; i < combinedSequanceLength; ++i) {
                    if (result.indexOf(combinedSequance[i]) === -1)
                        result.push(combinedSequance[i]);
                }
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


    /**
    *  Projects each element of a sequence into a new form.
    *  @param func A transform function to apply to each element.
    */
    private InitSelect = () => {
        var self = this;
        Array.prototype['select'] = function <T>(func: (value: T, index?: number) => any): Array<T> {

            let inputArray = (this as Array<T>);
            var result: Array<T> = [];

            if (!inputArray || inputArray.length === 0)
                return null;

            for (let i = 0; i < inputArray.length; ++i) {
                var transformed = func(inputArray[i], i);
                result.push(transformed);
            }
            return result;
        };
    };

    /**
    *  Produces the set intersection of two sequences by value of each property.
    */
    private InitIntersect = () => {
        Array.prototype['intersect'] = function <T>(secondSequance: Array<T>): Array<T> {
            let firstArray = (this as Array<T>);

            if (!firstArray || !secondSequance || (firstArray.length === 0 && secondSequance.length === 0))
                return null;

            let result: Array<T> = [];
            let properties = Object.keys(firstArray[0]);
            let firstArrayLength = firstArray.length;
            let secondArrayLength = secondSequance.length;

            if (properties.length > 0) {
                for (let i = 0; i < firstArrayLength; ++i) {

                    for (let j = 0; j < secondArrayLength; ++j) {
                        let propsWithSameValueCounter = 0;

                        for (let prop = 0; prop < properties.length; ++prop) {

                            if (secondSequance[j][properties[prop]] !== firstArray[i][properties[prop]]) {
                                break;
                            } else {
                                ++propsWithSameValueCounter;
                            }
                        }
                        if (propsWithSameValueCounter === properties.length) {
                            if (result.length === 0)
                                result.push(firstArray[i]);
                            else {
                                let elementDoesNotExistInResult = true;
                                for (let z = 0; z < result.length; ++z) {
                                    let resultPropsWithSameValueCounter = 0;

                                    for (let prop = 0; prop < properties.length; ++prop) {

                                        if (result[z][properties[prop]] === firstArray[i][properties[prop]]) {
                                            ++resultPropsWithSameValueCounter;
                                        } else {
                                            break;
                                        }
                                    }
                                    if (resultPropsWithSameValueCounter === properties.length) {
                                        elementDoesNotExistInResult = false;
                                    }
                                }
                                if (elementDoesNotExistInResult) {
                                    result.push(firstArray[i]);
                                }
                            }
                        }
                    }

                }
            } else {
                for (let element of firstArray) {
                    if (result.indexOf(element) === -1 && secondSequance.indexOf(element) !== -1) {
                        result.push(element);
                    }
                }
            }
            return result;
        };
    };

    /**
    *  Produces the subset of elements of input sequance that dont exist in second sequance.
    */
    private InitExcept = () => {
        var self = this;
        Array.prototype['except'] = function <T>(secondSequance: Array<T>): Array<T> {

            let firstSequance = (this as Array<T>);
            let result: Array<T> = [];
            let firstArrayLength = firstSequance.length;

            let properties = Object.keys(firstSequance[0]);

            if (properties.length) {
                for (let i = 0; i < firstArrayLength; ++i) {
                    let isInResult = false;
                    let isInSecondArray = false;

                    for (let j = 0; j < result.length; j++) {
                        let resultPropsWithSameValueCounter = 0;
                        for (let propIndex = 0; propIndex < properties.length; ++propIndex) {
                            if (result[j][properties[propIndex]] === firstSequance[i][properties[propIndex]]) {
                                ++resultPropsWithSameValueCounter;
                            }
                            if (resultPropsWithSameValueCounter === properties.length) {
                                isInResult = true;
                            }
                        }
                        if (isInResult) break;
                    }
                    if (!isInResult) {
                        let resultPropsWithSameValueCounter = 0;

                        for (let k = 0; k < secondSequance.length; ++k) {

                            for (let propIndex = 0; propIndex < properties.length; ++propIndex) {
                                if (secondSequance[k][properties[propIndex]] === firstSequance[i][properties[propIndex]]) {
                                    ++resultPropsWithSameValueCounter;
                                }
                                if (resultPropsWithSameValueCounter === properties.length) {
                                    isInSecondArray = true;
                                }
                            }
                            if (isInSecondArray) break;
                        }
                        if (!isInSecondArray)
                            result.push(firstSequance[i]);
                    }
                }
            }
            else {
                for (let firstArrElement of firstSequance) {
                    if (result.indexOf(firstArrElement) === -1 && secondSequance.indexOf(firstArrElement) === -1)
                        result.push(firstArrElement)
                }
            }
            return result;
        };
    };

    /**
    *  Bypasses a specified number of elements in a sequence and then returns the remaining elements.
    *  @param count The number of elements to skip before returning the remaining elements.
    */
    private InitSkip = () => {
        var self = this;
        Array.prototype['skip'] = function <T>(count: number): Array<T> {

            let inputArray = (this as Array<T>);
            let result: Array<T> = [];
            if (!inputArray)
                return null;
            let inputArrayLength = inputArray.length;

            for (let i = count; i < inputArrayLength; ++i) {
                result.push(inputArray[i]);
            }
            return result;
        };
    };

    /**
    * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
    *  @param func A function to test each source element for a condition;
    *  the second parameter of the function represents the index of the source element.
    */
    private InitSkipWhile = () => {
        var self = this;
        Array.prototype['skipWhile'] = function <T>(func: (value: T, index?: number) => boolean): Array<T> {

            let inputArray = (this as Array<T>);
            let result: Array<T> = [];
            if (!inputArray)
                return null;
            let inputArrayLength = inputArray.length;

            for (let i = 0; i < inputArrayLength; ++i) {
                if (!func(inputArray[i], i)) {
                    result = inputArray.slice(i);
                    break;
                }
            }
            return result;
        };
    };

    /**
    *  Returns a specified number of contiguous elements from the start of a sequence.
    *  @param count The number of elements to return.
    */
    private InitTake = () => {
        var self = this;
        Array.prototype['take'] = function <T>(count: number): Array<T> {

            let inputArray = (this as Array<T>);
            let result: Array<T> = [];
            if (!inputArray)
                return null;
            let inputArrayLength = inputArray.length;

            for (let i = 0; i < count && i < inputArrayLength; ++i) {
                result.push(inputArray[i]);
            }
            return result;
        };
    };
    
    /**
    * Returns elements from a sequence as long as a specified condition is true. The element's index is used in the logic of the predicate function.
    *  @param func A function to test each source element for a condition;
    *  the second parameter of the function represents the index of the source element.
    */
    private InitTakeWhile = () => {
        var self = this;
        Array.prototype['takeWhile'] = function <T>(func: (value: T, index?: number) => boolean): Array<T> {

            let inputArray = (this as Array<T>);
            let result: Array<T> = [];
            if (!inputArray)
                return null;
            let inputArrayLength = inputArray.length;

            for (let i = 0; i < inputArrayLength; ++i) {
                if (func(inputArray[i], i))
                    result.push(inputArray[i]);
                else
                    break;
            }
            return result;
        };
    };

    /**
    *  Projects each element of a sequence to an Array,
    *  flattens the resulting sequences into one sequence, and invokes a result selector
    *  function on each element therein. The index of each source element is used in
    *  the intermediate projected form of that element.
    *  @param func A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
    *  @param resultFunc A transform function to apply to each element of the intermediate sequence.
    */
    private InitSelectMany = () => {
        let self = this;
        Array.prototype['selectMany'] = function <T, T2, TResult>(func: (value: T, index?: number) => T2, resultFunc?: (value: T, collection: T2, index?: number) => any): Array<TResult | T2> {
            let result: Array<TResult | T2> = [];
            let firstArray = (this as Array<T>);
            let propertyName;

            if (!firstArray) return null;
            let sequanceLength = firstArray.length;
            if (sequanceLength === 0) return result;

            propertyName = self.GetPropertyName(func, firstArray[0]);

            //throw exception if property selected in func is NOT enumerable
            if (!firstArray[0][propertyName].hasOwnProperty('length')) {
                throw `Property ${propertyName} has to be of Array type (needs to have length property)`;
            }

            for (let i = 0; i < sequanceLength; ++i) {
                let collection = func(firstArray[i], i) as any;

                if (collection) {
                    for (let j = 0; j < collection.length; ++j) {

                        if (!resultFunc)
                            result.push(collection[j]);
                        else
                            result.push(resultFunc(firstArray[i], collection[j], j));
                    }
                }
            }
            return result;
        }
    };
}

export = new LinqJs();