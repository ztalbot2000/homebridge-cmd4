'use strict';

// Description:
//    Extracts a key from an object given a value.
//
// @param obj - The object to get the key from.
// @param value - The value to find.
//
// @returns key or undefined
//

var extractKeyValue = function (obj, value) {
    return Object.keys(obj)[Object.values(obj).indexOf(value)];
}

module.exports = extractKeyValue;
