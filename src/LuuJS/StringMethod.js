//đọc thêm trang web này
//https://viblo.asia/p/15-string-methods-duoc-su-dung-pho-bien-nhat-trong-javascript-jvElaWmxKkw 
//string.length, string.repeat(int)
//s[index], string.charAt(int), string.charCodeAt(int)
//string.toUpperCase(), string.toLowerCase()
//string.split()
//string.trim(), includes()
//Number(string) (Cách 2: +string) : biến string thành number 

let s = "hello baby";

console.log(s.length);

//string.repeat(int) -> lặp lại int lần 
console.log(s.repeat(3));

//s[index]
console.log(s[1]);

//charAt
console.log(s.charAt(1));
console.log(s.charCodeAt(1));

//string.toUpperCase() -> ko thay đổi string gốc
console.log(s.toUpperCase());

//string.toLowerCase()
console.log(s.toLowerCase());

//string.split() , khoảng trắng cũng là 1 kí tự
console.log(s.split()); // ko làm gì hết
console.log(s.split("")); //trả về 1 mảng với mỗi phần tử là 1 kí tự
console.log(s.split("o"));//tách theo kí tự "o"

//string.trim() ->xoá khoảng trắng 2 bên
console.log("  abc    ".trim());

//includes()
//string.includes("a") ktra có chữ a ko
//string.includes() có phân biệt chữ hoa chữ thường
let name = "maria ozaha";
console.log(name.includes("a")); //->true 
console.log(name.includes("mara")); //->false
console.log(name.includes("M")); //-> false

//string.endsWith() -> ko dùng Regular Expressions với hàm này đc (ví dụ: str.endsWith("/universE./i") -> lỗi cú pháp)
var str = "Hello world, welcome to the universe.";
console.log(str.endsWith("universe.")); //-> true

//biến string thành number
console.log(Number("123"));
console.log(+"123");
