const _ = require('lodash');

const arr1 = ['a', 'b', 'c', 'e'];
const arr2 = ['a', 'c', 'b', 'f'];

const res = _.difference(arr1, arr2);
console.log(res); // => ["e"]

// differenceBy() và differenceWith() gần giống difference(), nhưng nó có thêm tham số thứ 3
