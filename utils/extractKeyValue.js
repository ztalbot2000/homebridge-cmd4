'use strict';

var extractKeyValue = function (obj, value) {
    return Object.keys(obj)[Object.values(obj).indexOf(value)];
}

module.exports = extractKeyValue;
