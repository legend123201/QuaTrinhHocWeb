/*
// có 3 cách định nghĩa function
//cách 1: sử dụng "function declareation"
function addTwoNumbers(a, b) {
    console.log(a + b);
    return a + b;
}

console.log(addTwoNumbers(3, 7));

function checkOdd(number) {
    if (number % 2 !== 0) {
        return true;
    }
    return false;
}
console.log(checkOdd(11));




function printTo(n) {
    for (let i = 1; i <= n; i++) {
        console.log(i);
    }
}
printTo(11);

//cách 2: sử dụng "function expression"
//sử dụng 1 biến để lưu function

let addTwoNumbers2 = function (a, b) {
    console.log(a + b);
};
addTwoNumbers2(4, 9);

//cách 3: sử dụng "arrow function"

let addTwoNumbers3 = (a, b) => {
    console.log(a + b);
};
addTwoNumbers3(4, 10);

console.log("--------------");
console.log("BT1");
let IsGreater = (a, b) => {
    return (a > b);
};
console.log(IsGreater(3, 3));

console.log("BT2");
let check = (n) => {
    if (n % 4 === 0 && n % 6 === 0) {
        console.log(true);
    }
    else {
        console.log(false);
    }
};
check(8);
check(12);
check(24);

console.log("BT3");
let check3 = (n) => {
    for(let i = 1; i <= n; i++){
        if(i % 3 === 0 && i % 5 === 0){
            console.log(i);
        }
    }
};

check3(20);
check3(30);
*/