/*
------------------------LÝ THUYẾT
- Scope: phạm vi sử dụng 1 biến.

- Có 3 loại scope: block scope, global scope, function scope.
+ block scope (if, for, while, switch): let, const.
+ function scope: let, const, var. 
Chú ý: var nó đi tìm cái function gần nhất và chỉ đc phép hoạt động trong cái function đó và nó có thể dùng từ mọi nơi trong fuction đó cho dù nó được khai báo ở đâu trong function.
+ global scope: let, const, var.

*/


// global scope
var f;
let t;

// function scope
function test() {
    let a = 10;

    // block scope
    if (a > 5) {
        let b = 20;
        var c = 30;
        a += 10;
    }

    console.log(`a is ${a}`); // a have function scope
    //console.log(`b is ${b}`); // error, b in block scope, can not log here
    console.log(`c is ${c}`); // c have "var" type, function scope, so it still can be used here
}
