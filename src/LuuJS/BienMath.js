/* có thể biến Math đã thêm hàm, nên lâu lâu vô xem xem có gì mới ko
abs(x)	Returns the absolute value of x
acos(x)	Returns the arccosine of x, in radians
acosh(x)	Returns the hyperbolic arccosine of x
asin(x)	Returns the arcsine of x, in radians
asinh(x)	Returns the hyperbolic arcsine of x
atan(x)	Returns the arctangent of x as a numeric value between -PI/2 and PI/2 radians
atan2(y, x)	Returns the arctangent of the quotient of its arguments
atanh(x)	Returns the hyperbolic arctangent of x
cbrt(x)	Returns the cubic root of x
ceil(x)	Returns x, rounded upwards to the nearest integer
cos(x)	Returns the cosine of x (x is in radians)
cosh(x)	Returns the hyperbolic cosine of x
exp(x)	Returns the value of Ex
floor(x)	Returns x, rounded downwards to the nearest integer
log(x)	Returns the natural logarithm (base E) of x
max(x, y, z, ..., n)	Returns the number with the highest value
min(x, y, z, ..., n)	Returns the number with the lowest value
pow(x, y)	Returns the value of x to the power of y
random()	Returns a random number between 0 and 1
round(x)	Rounds x to the nearest integer
sign(x)	Returns if x is negative, null or positive (-1, 0, 1)
sin(x)	Returns the sine of x (x is in radians)
sinh(x)	Returns the hyperbolic sine of x
sqrt(x)	Returns the square root of x
tan(x)	Returns the tangent of an angle
tanh(x)	Returns the hyperbolic tangent of a number
trunc(x)	Returns the integer part of a number (x)
*/


//max, min, floor, ceil, round, random

//console.log(Math.max(1, 4, 7, 2)); //-> 7
//console.log(Math.min(1, 4, 7, 2, 1)); //-> 1
//max-min array muốn dùng thì phải dùng "..." nữa và dùng cho biến được
let a = 1, b = 2, c = 3;
let d = [9,7,10];
console.log(Math.max(a,b,c));//->3
console.log(Math.min(a,b,c));//->1
console.log(Math.max(d));//->NaN
console.log(Math.min(d));//->NaN
console.log(Math.max(...d));//->10
console.log(Math.min(...d));//->7
console.log(Math.max(d[0],d[1],d[2]));//-> 10
console.log(Math.min(d[0],d[1],d[2]));//-> 7

//làm tròn xuống
console.log(Math.floor(3.9)); //-> 3
console.log(Math.floor(-3.9)); //-> -4

//làm tròn lên
console.log(Math.ceil(3.1)); //-> 4
console.log(Math.ceil(-3.1));//-> -3

//làm tròn gần nhất
console.log("round");
console.log(Math.round(3.3));//-> 3
console.log(Math.round(3.6));//-> 4
console.log(Math.round(3.5));//-> 4
console.log(Math.round(-3.3));//-> -3
console.log(Math.round(-3.6));//-> -4
console.log(Math.round(-3.5));//-> -3

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
a = 3;
b = 5;
console.log(Math.floor((Math.random() * (b - a + 1)) + a));
//cách 2
console.log(Math.round((Math.random() * (b - a)) + a));
