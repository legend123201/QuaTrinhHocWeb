/*
const minusInfinitive = -9999;
//Bài 1: Tìm số lớn thứ 2 trong mảng
//	- Ex: let arr = [-1, 25, 2, 33, 4, 5]; // So lon thu 2 la 25

let arr = [-1, 25, 33, 4, 4, 5,-1, 25, 2, 33, 4, 5];

let topCanTim = 4;
let topDangTim = 1;
let ouput = minusInfinitive;
let arrtop = arr.sort(function (a, b) { return (a - b) });
console.log(arrtop);
//vòng for này chưa lọc 1 điều kiện lỗi, đó là topCanTim quá lớn, chỉ có 6 giá trị mà tìm top 7 thì thua
for(let i = 0; i < arrtop.length; i++){
    if(topDangTim == topCanTim){
        output = arrtop[i];
        break;
    }
    //vòng while lọc hết các số trùng đứng gần nhau
    while(arrtop[i] === arrtop[i + 1]){
        i++;
    }
    topDangTim++;
}
console.log(output);

// Bài 2: Kiểm tra trong mảng có tồn tại 3 số 1 liên tiếp hay không? (Tim hieu them break trong vong lap)
// 	- Ex: let arr = [0, 0, 1, 1, 1, 0, 1, 1, 0, 1]; // true
// 	- Ex: let arr = [0, 0, 1, 1, 0, 0, 1]; // false

let arr = [0, 0, 1, 1, 0, 0, 1, 1];
let temp = false;
let dem = 1;

for(let i = 0; i < arr.length; i++){
    dem = 1;
    while(arr[i] ===1 && arr[i] === arr[i+1] && temp === false){
        dem++;
        if(dem === 3){
            temp = true;
        }
        i++;
    }
}
console.log(temp);

//JS có cho phép chạy tiếp arr[i + 1] nếu như i + 1 = arr.length và so sánh như thường?? sướng vl
*/