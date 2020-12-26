//length,toString(),join(seperator),push(),pop(),shift(),unshift(), splice(), slice()
//array.reduce()


let numbers = [1, 2, 3, 4, 5];
//length
console.log(numbers.length); //-> 5

//toString()
console.log(numbers.toString()); //-> "1,2,3,4,5"

//join(seperator)
console.log(numbers.join("?")); //-> "1?2?3?4?5"

console.log(numbers.join('"')); //-> "1"2"3"4"5"

//push() -> thêm 1 phần tử vào cuối mảng
console.log(numbers.push("hello")); //-> 6 (độ dài mảng mới)
console.log(numbers);

console.log(numbers.push("tada", 123)); // -> 8
console.log(numbers);

//pop() -> lấy phần tử cuối, mảng mất phần tử cuối
console.log(numbers.pop());
console.log(numbers);

//shift() -> lấy phần tử đầu mảng, mảng mất phần tử đầu
console.log(numbers.shift()); 
console.log(numbers);

//unshift() -> thêm vào đầu mảng
console.log(numbers.unshift("lala")); // -> 7 (số phần tử mảng)
console.log(numbers);

//slice(a,b) -> cắt 1 mảng thành 1 mảng mới có các phần từ từ a đến b (ko lấy b);
//slice(a) -> cắt từ a đến cuối mảng luôn
//slice() -> mảng y chang mảng cũ
//b lớn hơn length của mảng ko bị lỗi, nó tự cắt đến cuối mảng thì dừng

let numbers = [1, 2, 3, 4, 5];
let a = numbers.slice(1, 3); //-> [2,3]
console.log(a);

let strings = ["samsung", "apple", "viettel", "highland"];
a = strings.slice(1, 10);
console.log(a);

a = strings.slice(2);
console.log(a);

//index của mảng có 2 chiều
//nếu là dương: [0,1,2,3,....]
//nếu là âm: [...,-3,-2,-1]
a = strings.slice(1, -1); //->"apple", "viettel" //chú ý: từ 1 đến -1 ko lấy -1
console.log(a);

let HaiPhanTuCuoiMang = strings.slice(-2);
//let HaiPhanTuCuoiMang = strings.slice(-2, -1); //sai vì lấy từ -2 đến -1 ko lấy -1
console.log(HaiPhanTuCuoiMang);

// lấy ra phần tử giữa mảng
// 2TH:
// 1. length chẵn -> 2 ptu giữa mảng
// 2. length lẻ -> 1 ptu giữa mảng
let strings2 = ["samsung", "apple", "viettel", "highland", "hello"];

//thêm "|| []" để nó nhắc lệnh cho a, vì nó ko tự hiểu a là mảng 
let PhanTuGiua = (a /*|| [] */) => {
    if (a.length % 2 === 0) {
        return a.slice(a.length / 2 - 1, a.length / 2 + 1);
    }
    else {
        return a.slice(a.length / 2, a.length / 2 + 1);
    }
};

console.log(PhanTuGiua(strings));
console.log(PhanTuGiua(strings2));

console.log(strings2.slice(2.9)); //hàm này nó tự làm tròn xuống là 2

//splice: thêm, xoá ptu trong mảng
//splice(startIndex, delete,add); //delete nghĩa là delete bao nhiêu ptu từ vị trí start
//splice trả về mảng chứa những phần tử đã xoá. ko xoá thì trả về mảng rỗng
//splice(index) -> cắt từ phần tử index về cuối, trả về 1 mảng 
console.log(strings.splice(2, 1, "name", "lala")); 
console.log(strings);

//thêm 1 ptu đằng trước ptu cuối
console.log(strings.splice(-1, 0, "pumpum"));
console.log(strings);

strings.splice(2, 100);
console.log(strings);

strings.splice(2); //cắt từ index 2 về cuối

//array.reduce()-------------------------------------------------------
//array.reduce() -> sau tất cả thì trả về acc
//nhận 2 tham số, func và initialValue
//cách hoạt động
//-ktra có giá trị initialValue hay ko
//---nếu không: acc = array[0], val = array[1] ở vòng lặp đầu tiên
//---nếu có: acc = initialValue, val = array[0] ở vòng lặp đầu tiên
let numbers = [1, 2, 3, 4, 5];

let total = numbers.reduce((acc, val, index) => {
    return acc + val;
});
console.log(total); //->15

//acc là biến giữ giá trị của return của vòng lặp trc
//vòng lặp 0: acc = 1 val = 2 --> acc = 3
//vòng lặp 1: acc = 3 val = 3 --> acc = 6
//vòng lặp 2: acc = 6 val = 4 --> acc = 10
//vòng lặp 3: acc = 10 val = 5 --> acc = 15

let total2 = numbers.reduce((acc, val, index) => {
    return acc + val;
}, 10);
console.log(total); //->25

let strings = ["hello", "baby", "are", "you", "ok"];

let strings2 = strings.reduce((acc, val, index) => {
    return acc + val;
});
console.log(strings2); //string dài ngoằng nối của mấy từ đó