//sort. lưu ý: thay đổi luôn cái mảng dùng nó
//chỉ ghi arr.sort() thì nó sẽ sắp xếp theo mã ascii

let numbers = [1,2,15,4,3,5,4,6];
numbers.sort();
console.log(numbers); //->[1, 15, 2, 3, 4,  4, 5, 6  ]

let arr = ["acb", "bb", "a", "b", 1, 023];
arr.sort();
console.log(arr); //->[ 1, 19, 'a', 'acb', 'b', 'bb' ]???????

//sap xep tang dan (sắp xếp giảm dần thì b - a)
//nó có trả về mảng đã đc sắp xếp, mảng chính cũng bị đổi luôn
//bỏ lẫn lộn string và number thì nó ko hoạt động, thậm chí toàn string cũng ko hoạt động, chỉ có sắp xếp đc number thôi
numbers.sort((a, b) => {return a-b});
console.log(numbers); //[1, 2, 3,  4 , 4, 5, 6, 15]

numbers.sort((a, b) => {return b - a});
console.log(numbers); //=> [15, 6, 5, 4, 4, 3, 2, 1]

//ko thể sắp xếp giảm dần bằng cách ngắn gọn
let strings = ["a","bc", "aac", "cba", "cc", "abc",""];
console.log(strings.sort()); //tăng dần -> ['', a', 'aac', 'abc', 'bc', 'cba', 'cc']
console.log(strings.sort((a,b)=>{return b - a;})); //vẫn tăng dần -> -> ['', a', 'aac', 'abc', 'bc', 'cba', 'cc']

//cách 1
console.log(strings.sort().reverse());

//cách 2
//phải làm so sánh >, <, = như bên c++
//giảm dần thành công
console.log(strings.sort((a,b)=>{
    if(a > b){
        return -1;
    }else if(a < b){
        return 1;
    }else{
        return 0;
    }
}));
