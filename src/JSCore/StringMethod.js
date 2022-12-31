// tất cả các string methods đều ko sửa string đc gọi, mà nó trả về 1 string mới
//match(), matchAll(), replace(), replaceAll(), search(), and split() có thể dùng RegExp
//chỉ có replace(), replaceAll() là có tham số thứ 2 có thể được chứa hàm, và hàm có công dụng rất quan trọng

//string.length, string.repeat(int)
//s[index], string.charAt(int), string.charCodeAt(int)
//string.toUpperCase(), string.toLowerCase()
//string.split()
//string.trim(), includes()
//Number(string) (Cách 2: +string) : biến string thành number

/*
charAt()	        Returns the character at the specified index (position)
charCodeAt()	    Returns the Unicode of the character at the specified index
concat()	        Joins two or more strings, and returns a new joined strings
endsWith()	        Checks whether a string ends with specified string/characters
fromCharCode()	    Converts Unicode values to characters
includes()	        Checks whether a string contains the specified string/characters
indexOf()	        Returns the position of the first found occurrence of a specified value in a string
lastIndexOf()	    Returns the position of the last found occurrence of a specified value in a string
localeCompare()	    Compares two strings in the current locale
match()	            Searches a string for a match against a regular expression, and returns the matches
repeat()	        Returns a new string with a specified number of copies of an existing string
replace()	        Searches a string for a specified value, or a regular expression, and returns a new string where the specified values are replaced
search()	        Searches a string for a specified value, or regular expression, and returns the position of the match
slice()	            Extracts a part of a string and returns a new string
split()	            Splits a string into an array of substrings
startsWith()	    Checks whether a string begins with specified characters
substr()	        Extracts the characters from a string, beginning at a specified start position, and through the specified number of character
substring()	        Extracts the characters from a string, between two specified indices
toLocaleLowerCase()	Converts a string to lowercase letters, according to the host's locale
toLocaleUpperCase()	Converts a string to uppercase letters, according to the host's locale
toLowerCase()	    Converts a string to lowercase letters
toString()	        Returns the value of a String object
toUpperCase()	    Converts a string to uppercase letters
trim()          	Removes whitespace from both ends of a string
valueOf()	        Returns the primitive value of a String object
*/

let s = "hello baby";

console.log(s.length); //-> 10

//string.repeat(int) -> lặp lại int lần
console.log(s.repeat(3)); //-> hello babyhello babyhello baby (ko có dấu cách giữa các lần lặp lại)

//s[index]
console.log(s[1]); //-> e
//ko thể sửa đc s[1] thành giá trị khác, vì string ko phải array, s[1] = "a" ko lỗi, nhưng cũng ko có tác dụng, có thể đổi string qua array rồi muốn làm gì thì làm

//charAt
console.log(s.charAt(1)); //-> e
console.log(s.charCodeAt(1)); // -> 101

//string.toUpperCase()
console.log(s.toUpperCase()); //-> HELLO BABY

//string.toLowerCase()
console.log(s.toLowerCase()); //-> hello baby

//string.split() -> chia chuổi ra thành mảng
console.log(s.split()); //-> [ 'hello baby' ] (mảng 1 phần tử)
console.log(s.split("")); //-> [ 'h', 'e', 'l', 'l', 'o', ' ', 'b', 'a', 'b', 'y' ] (trả về 1 mảng với mỗi phần tử là 1 kí tự)
console.log(s.split("o")); //-> [ 'hell', ' baby' ] (tách theo kí tự "o")

//string.trim() ->xoá khoảng trắng 2 bên
console.log("  abc    ".trim()); //-> abc

//includes()
//string.includes("a") ktra có chữ a ko
//string.includes() có phân biệt chữ hoa chữ thường
let nam = "maria ozaha";
console.log(nam.includes("a")); //->true
console.log(nam.includes("mara")); //->false
console.log(nam.includes("M")); //-> false

//string.endsWith() -> ko dùng Regular Expressions với hàm này đc (ví dụ: str.endsWith("/universE./i") -> lỗi cú pháp)
var str = "Hello world, welcome to the universe.";
console.log(str.endsWith("universe.")); //-> true

//biến string thành number
console.log(Number("123"));
console.log(+"123");
