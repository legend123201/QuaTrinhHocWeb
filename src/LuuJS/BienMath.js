//random, round, ceil, floor, max, min

console.log(Math.max(1, 4, 7, 2));
console.log(Math.min(1, 4, 7, 2, 1));

//làm tròn xuống
console.log("floor");
console.log(Math.floor(3.9)); //3
console.log(Math.floor(-3.9)); //-4

//làm tròn lên
console.log("ceil");
console.log(Math.ceil(3.1));
console.log(Math.ceil(-3.1));

//làm tròn gần nhất
console.log("round");
console.log(Math.round(3.3));
console.log(Math.round(3.6));
console.log(Math.round(3.5));
console.log(Math.round(-3.3));
console.log(Math.round(-3.6));
console.log(Math.round(-3.5));

//random 1 số thực
console.log("random");
console.log(Math.random()); //0 -> 0.999999..... (~1)
console.log(Math.random() * 5); // 0 -> 5

//random số nguyên
console.log(Math.floor(Math.random())); // 0
console.log(Math.floor(Math.random() * 5)); //0 -> 4
console.log(Math.round(Math.random() * 5)); //0 -> 5

console.log("random 1 số từ 5 tới 20");
console.log(Math.floor((Math.random() * (20 + 1 - 5)) + 5));

console.log("random 1 số từ a đến b (bao gồm a và b)");
let a = 3;
let b = 5;
console.log(Math.floor((Math.random() * (b - a + 1)) + a));
//cách 2
console.log(Math.round((Math.random() * (b - a)) + a));
