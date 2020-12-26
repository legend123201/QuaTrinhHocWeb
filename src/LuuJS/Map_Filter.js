//map()
//tham số của .map() là 1 function
//map trả về 100% là mảng mới có độ dài bằng mảng cũ
//mảng trả về sẽ có các phần tử là giá trị sau return.
//.map((val, index)=>{}) thì tham số đầu (val) giữ giá trị, tham số sau (index) giữ vị trí, thay tên khác tuỳ ý muốn

let products = ["apple", "viettel", "samsung", "sony"];
let newProducts = products.map((val, index) => {
    if (val.length > 4) {
        return val; //[ 'apple', 'viettel', 'samsung', undefined ]
    }
});
console.log(newProducts);

//filter()
//tham số của nó cũng là 1 function
//trả về mảng mới gồm những phần tử val thoả điều kiện sau return 
//điều điện sau return true thì "val đc trả về" (luôn luôn là val đc trả về).
//ko cái nào thoả điều kiện thì trả về mảng rỗng
let numbers = [1, 2, 3, 5, 10];
const newNumbers = numbers.filter((val, index) => {
    return val > 4; //->[ 5, 10 ]
});
console.log(newNumbers);

const newProducts2 = products.filter((val, index) => {
    return val.length > 5; //->[ 'viettel', 'samsung' ]
});
console.log(newProducts2);
