/**
 * Checks if arg is a function
 * @param {*} arg - argument to check
 * @param {function} stub - function to return, if arg is not a function
 * @returns arg, if it is a function, if not - returns stub instead
 */
 export function checkFunctionArgument(arg, stub = ((() => { }))) {
    return (typeof (arg) == 'function' && arg) || stub;
};

/**
 * Checks if arg is a function and calls it with value as a parameter
 * @param {*} arg - argument to check
 * @param {value} stub - parameter to pass into arg on call, if arg is a function
 */
export function checkAndCallFunction(arg, value) {
    typeof (arg) == 'function' && arg(value);
}

/**
 * Checks if arg is a number
 * @param {*} arg - argument to check
 * @param {number} stub - number to return, if arg is not a number
 * @returns arg, if it is a number, if not - returns stub instead
 */
export function checkNumberArgument(arg, stub = 0) {
    if (arg !== null && !isNaN(+arg))
        return +arg; 
    return stub;
}