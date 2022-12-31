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
