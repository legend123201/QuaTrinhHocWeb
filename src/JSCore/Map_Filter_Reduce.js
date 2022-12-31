//----------------------------------------------------------------------arr.map()
/*
//tham số của .map() là 1 function, chạy qua từng phần tử mảng để xử lý
//map trả về 100% là mảng mới có độ dài bằng mảng cũ
//mảng trả về sẽ có các phần tử là giá trị sau return.
//arr.map((val, index, arr)=>{}) thì tham số đầu (val) giữ giá trị, tham số sau (index) giữ vị trí của phẩn tử hiện tại, tham số arr là cái mảng gọi cái hàm lun, thay tên khác tuỳ ý muốn
//arr.map() thực ra còn tham số nữa là thisValue arr.map((val, index, arr)=>{}, thisValue), trên w3school có giải thích cơ mà khi test lại ko ra kết quả gì cả, khó xài
//Note: this method does not change the original array.

let products = ["apple", "viettel", "samsung", "sony"];
let newProducts = products.map((val, index) => {
    if (val.length > 4) {
        return val; //[ 'apple', 'viettel', 'samsung', undefined ]
    }
});
console.log(newProducts); //[ 'apple', 'viettel', 'samsung', undefined ]

let newProducts2 = products.map((val, index, arr) => {
    if (val.length > 4) {
        return val; //[ 'apple', 'viettel', 'samsung', undefined ]
    }
    else{
        return arr;
    }
});
console.log(newProducts2);//-> ['apple','viettel','samsung',[ 'apple', 'viettel', 'samsung', 'sony' ]]
*/


//---------------------------------------------------------------------filter()
/*
//tham số của nó cũng là 1 function
//array.filter(function(val, index, arr), thisValue) -> các biến thì có ý nghĩa y chang map()
//trả về mảng mới gồm những phần tử val thoả điều kiện sau return 
//điều điện sau return true thì "val đc trả về" (luôn luôn là val đc trả về).
//ko cái nào thoả điều kiện thì trả về mảng rỗng
//Note: filter() does not change the original array.


let numbers = [1, 2, 3, 5, 10];
const newNumbers = numbers.filter((val, index) => {
    return val > 4; 
});
console.log(newNumbers);//->[ 5, 10 ]

let products = ["apple", "viettel", "samsung", "sony"];
const newProducts2 = products.filter((val, index) => {
    return val.length > 5; 
});
console.log(newProducts2);//->[ 'viettel', 'samsung' ]

//trường hợp cần lưu ý
const newNumbers2 = numbers.filter((val, index) => {
    return 2; 
    //return 0;
});
console.log(newNumbers2);//->[ 1, 2, 3, 5, 10 ] với trường hợp return 2; 
//-> [] đối với trường hợp return 0
//-> thì mệnh để sau return là true thì val đc trả về thôi <3
*/

//---------------------------------------------------------------array.reduce()
//array.reduce() -> sau tất cả thì trả về total
//nhận 2 tham số, func và initialValue
//array.reduce(function(total, val, index, arr), initialValue) => val, index, arr có ý nghĩa giống 2 cái trên

//cách hoạt động
//-ktra có giá trị initialValue hay ko
//---nếu không: total = array[0], val = array[1] ở vòng lặp đầu tiên
//---nếu có: total = initialValue, val = array[0] ở vòng lặp đầu tiên
//Note: This method does not change the original array.

let numbers = [1, 2, 3, 4, 5];

let total = numbers.reduce((total, val, index) => {
    return total + val;
});
console.log(total); //->15

//total là biến giữ giá trị của return của vòng lặp trc
//vòng lặp 0: total = 1 val = 2 --> total = 3
//vòng lặp 1: total = 3 val = 3 --> total = 6
//vòng lặp 2: total = 6 val = 4 --> total = 10
//vòng lặp 3: total = 10 val = 5 --> total = 15

let total2 = numbers.reduce((total, val, index) => {
    return total + val;
}, 10);
console.log(total); //->25

let strings = ["hello", "baby", "are", "you", "ok"];

let strings2 = strings.reduce((total, val, index) => {
    return total + val;
});
console.log(strings2); //string dài ngoằng nối của mấy từ đó
