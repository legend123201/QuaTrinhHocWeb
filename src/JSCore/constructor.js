//object.constructor
//constructor trong js sẽ tham chiếu đến cái hàm của cái object đc gọi
//construct có thể dùng để kiểm tra cái nào là array, cái nào là số, là object,....
/*
For JavaScript arrays the constructor property returns function Array() { [native code] }
For JavaScript numbers the constructor property returns function Number() { [native code] }
For JavaScript strings the constructor property returns function String() { [native code] }
*/

let arr = [1,2,3];
console.log(arr.constructor); //-> [Function: Array]

let n = 5;
console.log(n.constructor); //-> [Function: Number]

let s = "abc";
console.log(s.constructor); //-> [Function: String]

let user = {name: "luu", age: 18};
console.log(user.constructor);  //-> [Function: Object]

let a = (x) => {return x = x + 1;};
console.log(a.constructor); // -> [Function: Function]

/*
console.log(x.constructor); //-> chưa khởi tạo x nên sẽ bị lỗi Cannot access 'x' before initialization
let x;
console.log(x.constructor); //-> ko đọc đc constructor của undefine vì nó ko tồn tại function nào, lỗi là Cannot read property 'constructor' of undefined
*/