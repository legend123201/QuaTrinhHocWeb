//isNaN(number), Number(sth)
//number.toString() (cách 2: number + "")
//parseInt(number)



//isNaN(number)
console.log(isNaN(23)); //false

//Number(sth)
//ép kiểu qua số, luôn luôn ép kiểu của nó qua số được, nhưng giá trị có thể là NaN
console.log(typeof(Number("123"))); //->number
console.log(typeof(Number("12a"))); //->number
console.log(typeof(Number("abc"))); //->number
console.log(Number("123")); //->123
console.log(Number("12a")); //->NaN
console.log(Number("abc")); //->NaN

//number.toString()
let number = 136;
console.log(number + "");
console.log(number.toString());

//parseInt(number) -> biến thành số nguyên (ko đc là số thực)
console.log(Number("126.5"));
console.log(parseInt("126.8"));