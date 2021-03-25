//1 số thứ về empty array và array (log(arr), typeof(arr), arr.length, arr[outOfIndex])
//1 số thứ về array ko rỗng (log(arr), arr.length, arr[outOfIndex])
//prototype
//toString(),join(seperator)
//push(),pop(),shift(),unshift()
//slice()
//splice()
//array.reduce()
//find(), findIndex() ở bên file Object.js phần Bài tập

//---------------------------------------1 số thứ về empty array
/*
let emptyArray = [];
console.log(emptyArray); // -> []
console.log(typeof(emptyArray)); // -> object
console.log(emptyArray.length); // -> 0
console.log(emptyArray[1]); //-> undefined
*/

//-------------------------------------1 số thứ về array ko rỗng 
/*
let numbers = [1, 2, 3, 4, 5];
console.log(numbers); // -> [1, 2, 3, 4, 5]
console.log(numbers.length); //-> 5
console.log(numbers[6]); //-> undefined

// hồi xưa nghĩ là chạy vòng for vượt quá length sẽ ko sao -> sai
let tong;
for(let i = 0; i < 10; i++){
    console.log(numbers[i]); //-> 1 2 3 4 5 undefined undefined undefined undefined undefined (mỗi cái 1 hàng)
    tong += numbers[i];
}
console.log(tong); //-> NaN 
*/

//------------------------------------------------------prototype
//hỗ trợ tạo 1 cái hàm cho arr, lần sau có thể tái sử dụng dễ dàng
/*
Array.prototype.myUcase = function () {
    for (let i = 0; i < this.length; i++) {
        this[i] = this[i].toUpperCase();
    }
};
var fruits = ["Banana", "Orange", "Apple", "Mango"];
fruits.myUcase();
console.log(fruits.myUcase()); //undefined
console.log(fruits); //-> [ 'BANANA', 'ORANGE', 'APPLE', 'MANGO' ]
*/

//---------------------------------------------------------------toString(),join(seperator)
/*
//Note: 2 method này will not change the original array.
let numbers = [1, 2, 3, 4, 5];
//toString() 
console.log(numbers.toString()); //-> "1,2,3,4,5"


//join(seperator) -> return string 
console.log(numbers.join()); //-> 1,2,3,4,5 (vì mặc định nó dùng dấu ",")
console.log(numbers.join("")); //-> 12345
console.log(numbers.join("?")); //-> "1?2?3?4?5"
console.log(numbers.join('"')); //-> "1"2"3"4"5"
*/

//-----------------------------------------------------------push(),pop(),shift(),unshift(), splice(), slice()
/*
//Note: Those method changes an array.
let numbers = [1, 2, 3, 4, 5];
//push() -> thêm 1 phần tử vào cuối mảng
console.log(numbers.push("hello")); //-> 6 (độ dài mảng mới) (xài hàm thì nó wtrả về length mới)
console.log(numbers); //-> [ 1, 2, 3, 4, 5, 'hello' ]

//có thế add 1 lúc nhiều items
console.log(numbers.push("tada", 123)); // -> 8
console.log(numbers); //-> [ 1, 2, 3, 4, 5, 'hello', 'tada', 123 ]

//pop() -> lấy phần tử cuối, mảng mất phần tử cuối
console.log(numbers.pop()); //-> 123
console.log(numbers);//-> [ 1, 2, 3, 4, 5, 'hello', 'tada' ]

//shift() -> lấy phần tử đầu mảng, mảng mất phần tử đầu
console.log("xxxxxxxxxxxxxxxxx");
console.log(numbers.shift()); //-> 1
console.log(numbers); //-> [ 2, 3, 4, 5, 'hello', 'tada' ]

//unshift() -> thêm vào đầu mảng
console.log(numbers.unshift("lala")); // -> 7 (số phần tử mảng)
console.log(numbers);//-> [ 'lala', 2, 3, 4, 5, 'hello', 'tada' ]
*/


//--------------------------------------------------------------- slice()
/*
//Note: The original array will not be changed.
//slice(a,b) -> cắt 1 mảng thành 1 mảng mới có các phần tử từ a đến b (ko lấy b);
//slice(a) -> cắt từ a đến cuối mảng luôn
//slice() -> mảng y chang mảng cũ
//b lớn hơn length của mảng ko bị lỗi, nó tự cắt đến cuối mảng thì dừng

let numbers = [1, 2, 3, 4, 5];
let a = numbers.slice(1, 3); 
console.log(a);//-> [2,3]

let strings = ["samsung", "apple", "viettel", "highland"];
a = strings.slice(1, 10); //số cuối to quá vẫn ko sao
console.log(a); //-> [ 'apple', 'viettel', 'highland' ]
a = strings.slice(2);
console.log(a);//-> [ 'viettel', 'highland' ]

//index của mảng có 2 chiều
//nếu là dương: [0,1,2,3,....]
//nếu là âm: [...,-3,-2,-1]
a = strings.slice(1, -1); //->"apple", "viettel" //chú ý: từ 1 đến -1 ko lấy -1
console.log(a);//-> [ 'apple', 'viettel' ]

let HaiPhanTuCuoiMang = strings.slice(-2);
//let HaiPhanTuCuoiMang = strings.slice(-2, -1); //sai vì lấy từ -2 đến -1 ko lấy -1
console.log(HaiPhanTuCuoiMang);//-> [ 'viettel', 'highland' ]

// lấy ra phần tử giữa mảng
// 2TH:
// 1. length chẵn -> 2 ptu giữa mảng
// 2. length lẻ -> 1 ptu giữa mảng
let strings2 = ["samsung", "apple", "viettel", "highland", "hello"];

//thêm "|| []" sau a để nó nhắc lệnh cho a, vì nó ko tự hiểu a là mảng
let PhanTuGiua = (a) => {
    if (a.length % 2 === 0) {
        return a.slice(a.length / 2 - 1, a.length / 2 + 1);
    }
    else {
        return a.slice(a.length / 2, a.length / 2 + 1);
    }
};

console.log(PhanTuGiua(strings)); //-> [ 'apple', 'viettel' ]
console.log(PhanTuGiua(strings2));//-> [ 'viettel' ]

console.log(strings2.slice(2.9)); //hàm này nó tự làm tròn xuống là 2 //-> [ 'viettel', 'highland', 'hello' ]
*/

//---------------------------------------------------------------splice()
/*
//Note: This method changes the original array.
//splice: thêm, xoá ptu trong mảng
//splice(startIndex, numberDelete,add); //numberDelete nghĩa là delete bao nhiêu ptu từ vị trí start, add là 1 hoặc nhiều giá trị để thêm vào
//splice trả về mảng chứa những phần tử đã xoá. ko xoá thì trả về mảng rỗng
//splice(index) -> cắt từ phần tử index về cuối, trả về 1 mảng

let strings = ["samsung", "apple", "viettel", "highland"];

console.log(strings.splice(2, 1, "name", "lala"));//-> [ 'viettel' ]
console.log(strings);//-> [ 'samsung', 'apple', 'name', 'lala', 'highland' ]

//thêm 1 ptu đằng trước ptu cuối
console.log(strings.splice(-1, 0, "pumpum")); //-> []
console.log(strings); //-> [ 'samsung', 'apple', 'name', 'lala', 'pumpum', 'highland' ]
console.log(strings.splice(2, 100));//-> [ 'name', 'lala', 'pumpum', 'highland' ]
console.log(strings);// [ 'samsung', 'apple' ]
console.log(strings.splice(2)); //cắt từ index 2 về cuối //-> []
*/
