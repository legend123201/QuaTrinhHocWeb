/*
Hoisting is JavaScript's default behavior of moving declarations to the top. In other words, a variable can be used before it has been declared. Just “var” type have this behavior.
*/

function DemoHoisting() {
    c = 10;

    if (c > 2) {
        console.log("Varible c greater than 2!");
    }

    var c;
}

DemoHoisting();