// có 3 cách định nghĩa function

/*
Cách 1: Function declaration
# Key Points:
Hoisted: Can be called before its definition.
Named function: Always has a name.
Creates its own this (regular function behavior).
Good for defining utility functions that should be available anywhere.
*/
function addTwoNumbers(a, b) {
    return a + b;
}
console.log(addTwoNumbers(3, 7));
/*
Cách 2: Function expression
# Key Points:
Not hoisted: Must be defined before use.
Can be anonymous (cách 2 này là assign hàm cho 1 biến, như ví dụ ở dưới, hàm đó ko có tên, hàm đó đc assign cho 1 biến) or named (for better stack traces).
Often used to assign functions to variables, objects, or pass as callbacks.
*/
let addTwoNumbers2 = function (a, b) {
    console.log(a + b);
};
addTwoNumbers2(4, 9);

/*
Cách 3: Arrow function
# Key Points:
Shorter syntax for simple functions.
Lexical "this": Inherits "this" from surrounding scope (no own "this"). (Mình đã note vào file Arrow function lexical this)
Cannot be used as a constructor (new will throw error).
Great for callbacks, array methods (.map(), .filter(), ...), concise functions.
*/
let IsGreater = (a, b) => {
    return (a > b);
};
console.log(IsGreater(3, 3));
