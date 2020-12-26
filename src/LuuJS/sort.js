//sort. lưu ý: thay đổi luôn cái mảng dùng nó
//chỉ ghi arr.sort() thì nó sẽ sắp xếp theo mã ascii

let numbers = [1,2,15,4,3,5,4,6];
numbers.sort();
console.log(numbers); //->[ 1, 15, 2, 4 ]

let arr = ["acb", "bb", "a", "b", 1, 023];
arr.sort();
console.log(arr); //->[ 1, 19, 'a', 'acb', 'b', 'bb' ]???????

//sap xep tang dan (sắp xếp giảm dần thì b - a)
//nó có trả về mảng đã đc sắp xếp, mảng chính cũng bị đổi luôn
//bỏ lẫn lộn string và number thì nó ko hoạt động, chỉ có sắp xếp đc number thôi
numbers.sort((a, b) => {return a-b});
console.log(numbers);

//ko thể sắp xếp giảm dần bằng cách ngắn gọn
//phải làm so sánh >, <, =
let strings = ["a","bc", "aac", "cba", "cc", "abc",""];
console.log(strings.sort()); //tăng dần
console.log(strings.sort((a,b)=>{return b - a;})); //vẫn tăng dần
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
//cách 2
console.log(strings.sort().reverse());