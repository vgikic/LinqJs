
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
    }

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
    *   Determines the minimum value of specific property.
    */
    private InitMinBy = () => {
        Array.prototype['minby'] = function <T>(property: string): T {
            let inputArray = (this as Array<T>);

            if (!inputArray || inputArray.length === 0)
                return null;

            if (!(property in inputArray[0])) {
                throw `Property ${property} does not exist in type ${inputArray}`;
            }

            let result: T = (inputArray) ? inputArray[0] : null;
            let sequanceLength = inputArray.length;

            for (let i = 1; i < sequanceLength; ++i) {
                if (result[property] > inputArray[i][property]) {
                    result = inputArray[i];
                }
            }
            return result;
        }
    };

    /**
    *   Determines the maximum value of specific property.
    */
    private InitMaxBy = () => {
        Array.prototype['maxby'] = function <T>(property: string): T {
            let inputArray = (this as Array<T>);

            if (!inputArray || inputArray.length === 0)
                return null;

            if (!(property in inputArray[0])) {
                throw `Property ${property} does not exist in type ${inputArray}`;
            }

            let result: T = (inputArray) ? inputArray[0] : null;
            let sequanceLength = inputArray.length;

            for (let i = 1; i < sequanceLength; ++i) {
                if (result[property] < inputArray[i][property]) {
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
        Array.prototype['orderby'] = function <T>(func: (value: T) => any): Array<T> {

            let inputArray = (this as Array<T>);

            if (!inputArray || inputArray.length === 0)
                return null;

            if (!(/\.([^\.;]+);?\s*\}$/.exec(func.toString()))) {
                throw `Function argument has to be lambda expression that returns property, e.g. for Id property it would look like this: (x)=>x.Id `;
            }

            let propertyName = (/\.([^\.;]+);?\s*\}$/.exec(func.toString())[1]);

            if (!(propertyName in inputArray[0])) {
                let properties = "";
                for (let prop in inputArray[0]) {
                    properties += ` '${prop}'`
                }

                throw `Property ${propertyName} does not exist selected type.\n Properties in object are: ${properties}`;
            }

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
        Array.prototype['orderbydesc'] = function <T>(func: (value: T) => any): Array<T> {

            let inputArray = (this as Array<T>);

            if (!inputArray || inputArray.length === 0)
                return null;

            if (!(/\.([^\.;]+);?\s*\}$/.exec(func.toString()))) {
                throw `Function argument has to be lambda expression that returns property, e.g. for Id property it would look like this: (x)=>x.Id `;
            }

            let propertyName = (/\.([^\.;]+);?\s*\}$/.exec(func.toString())[1]);

            if (!(propertyName in inputArray[0])) {
                let properties = "";
                for (let prop in inputArray[0]) {
                    properties += ` '${prop}'`
                }

                throw `Property ${propertyName} does not exist selected type.\n Properties in object are: ${properties}`;
            }

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

}

export = new LinqJs();