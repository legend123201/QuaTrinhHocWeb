//sort. lưu ý: thay đổi luôn cái mảng dùng nó
//chỉ ghi arr.sort() thì nó sẽ sắp xếp theo mã ascii

let numbers = [1, 2, 15, 4, 3, 5, 4, 6];
numbers.sort();
console.log(numbers); //->[1, 15, 2, 3, 4,  4, 5, 6  ]

let arr = ["acb", "bb", "a", "b", 1, 023];
arr.sort();
console.log(arr); //->[ 1, 19, 'a', 'acb', 'b', 'bb' ]???????

//sap xep tang dan (sắp xếp giảm dần thì b - a)
//nó có trả về mảng đã đc sắp xếp, mảng chính cũng bị đổi luôn
//bỏ lẫn lộn string và number thì nó ko hoạt động, thậm chí toàn string cũng ko hoạt động, chỉ có sắp xếp đc number thôi
numbers.sort((a, b) => {
  return a - b;
});
console.log(numbers); //[1, 2, 3,  4 , 4, 5, 6, 15]

numbers.sort((a, b) => {
  return b - a;
});
console.log(numbers); //=> [15, 6, 5, 4, 4, 3, 2, 1]

//ko thể sắp xếp giảm dần bằng cách ngắn gọn
let strings = ["a", "bc", "aac", "cba", "cc", "abc", ""];
console.log(strings.sort()); //tăng dần -> ['', a', 'aac', 'abc', 'bc', 'cba', 'cc']
console.log(
  strings.sort((a, b) => {
    return b - a;
  })
); //vẫn tăng dần -> -> ['', a', 'aac', 'abc', 'bc', 'cba', 'cc']

//cách 1
console.log(strings.sort().reverse());

//cách 2
//phải làm so sánh >, <, = như bên c++
//giảm dần thành công
console.log(
  strings.sort((a, b) => {
    if (a > b) {
      return -1; //có thể cho giá trị khác miễn là âm là đc
    } else if (a < b) {
      return 1; //có thể cho giá trị khác miễn là dương là đc
    } else {
      return 0;
    }
  })
);
/*
If a and b are two elements being compared, then:
a - The first element for comparison.
b - The second element for comparison.

If compareFunction(a, b) returns a value < than 0, sort "a" before "b".
If compareFunction(a, b) returns a value > than 0, sort "b" before "a".
If compareFunction(a, b) returns 0, "a" and "b" are considered equal.

- compareFunction mình tự định nghĩa làm sao đó mà nó trả về giá trị.
- qua định nghĩa mình đã hiểu rõ về cách thức vận hành của hàm sort
compareFunction(a,b) mà trả về giá trị âm thì số a đứng trước số b (số đầu tiên đứng trước số thứ hai), vậy thì nhìn lại dòng 
if (a > b) {
    return -1;
}
Nó có nghĩa nếu như "a lớn hơn b" thì "sắp xếp a đứng trước b" (tại trả về giá trị âm mà), a lớn hơn mà sắp a đứng trước thì giảm dần là đúng rồi.
Hay là như dòng "return b - a" nghĩa là giảm dần, vì sao lại thế, thì giờ giả dụ a lớn hơn b tiếp, nghĩa là b - a < 0, nghĩa là sắp a trước b, vậy là giảm dần là đúng rồi. 
*/
