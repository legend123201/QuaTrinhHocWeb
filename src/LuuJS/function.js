//1 hàm có thể trả về return [1, "1", true]; JS tự hiểu và chấp nhận luôn, xuất ra quá đẹp
// có 3 cách định nghĩa function
//cách 1: sử dụng "function declareation"
function addTwoNumbers(a, b) {
    return a + b;
}
console.log(addTwoNumbers(3, 7));

//cách 2: sử dụng "function expression"
//sử dụng 1 biến để lưu function
let addTwoNumbers2 = function (a, b) {
    console.log(a + b);
};
addTwoNumbers2(4, 9);

//cách 3: sử dụng "arrow function"
let IsGreater = (a, b) => {
    return (a > b);
};
console.log(IsGreater(3, 3));
