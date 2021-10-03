//Bài 1: Tìm số lớn thứ 2 trong mảng
// Bài 2: Kiểm tra trong mảng có tồn tại 3 số 1 liên tiếp hay không? (Tim hieu them break trong vong lap)
//3. Định nghĩa 1 function có chức năng - random 1 số từ a đến b
//4. Định nghĩa 1 function có chức năng - trả về độ dài của 1 string
//5. Định nghĩa 1 function có chức năng - trả số lớn nhất trong 3 số a,b,c
//6.Định nghĩa 1 function kiếm tra 1 số có phải là số đẹp hay không? Số đẹp là số mà các chữ số của nó không trùng nhau
//7. changTime: đổi định dạng thời gian 0:0:00 -> 00:00:00
//8. xoá số trùng nhau. 2TH: lộn xộn và đã sort
//9. đổi tất cả chữ b thành dấu + (tương tự làm tất cả chữ b thành B).
//10. tìm số lớn nhất trong mảng.
//11. ktra xem 1 số có đối xứng ko? cách nhanh.

const minusInfinitive = -9999;
//Bài 1: Tìm số lớn thứ 2 trong mảng
//	- Ex: let arr = [-1, 25, 2, 33, 4, 5]; // So lon thu 2 la 25

let arr = [-1, 25, 33, 4, 4, 5, -1, 25, 2, 33, 4, 5];

let topCanTim = 4;
let topDangTim = 1;
let ouput = minusInfinitive;
let arrtop = arr.sort(function (a, b) {
  return a - b;
});
console.log(arrtop);
//vòng for này chưa lọc 1 điều kiện lỗi, đó là topCanTim quá lớn, chỉ có 6 giá trị mà tìm top 7 thì thua
for (let i = 0; i < arrtop.length; i++) {
  if (topDangTim == topCanTim) {
    output = arrtop[i];
    break;
  }
  //vòng while lọc hết các số trùng đứng gần nhau
  while (arrtop[i] === arrtop[i + 1]) {
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

for (let i = 0; i < arr.length; i++) {
  dem = 1;
  while (arr[i] === 1 && arr[i] === arr[i + 1] && temp === false) {
    dem++;
    if (dem === 3) {
      temp = true;
    }
    i++;
  }
}
console.log(temp);

//JS có cho phép chạy tiếp arr[i + 1] nếu như i + 1 = arr.length và so sánh như thường?? sướng vl

//3. Định nghĩa 1 function có chức năng - random 1 số từ a đến b
let Random = (a, b) => {
  console.log(Math.round(Math.random() * (b - a) + a));
};
Random(1, 2);

//4. Định nghĩa 1 function có chức năng - trả về độ dài của 1 string

let stringLen = (s) => {
  console.log(s.length);
};
stringLen("hello"); //5
stringLen("hellobaby"); //9

//5. Định nghĩa 1 function có chức năng - trả số lớn nhất trong 3 số a,b,c

let Maxi = (a, b, c) => {
  console.log(Math.max(a, b, c));
};

Maxi(-5, 7, 20);

// 6.Định nghĩa 1 function kiếm tra 1 số có phải là số đẹp hay không? Số đẹp là số mà các chữ số của nó không trùng nhau
//cách 2:(ch0 vào mảng, sắp xếp tăng dần, 2 ptu giống nhau đứng cạnh nhau thì false) let arr = a.toString().split(""); arr.sort(...); for(...)
let IsGoodNum = (a) => {
  if (a < 0) {
    a = -a;
  }
  //cho "phần tử" mảng có "index là cái số chia lấy dư" giá trị 1, nếu như chỗ đó đã bằng 1 thì bị trùng hoy
  let temp = [];

  while (a !== 0) {
    if (temp[a % 10] === 1) {
      console.log(false);
      return;
    } else {
      temp[a % 10] = 1;
    }

    a = Math.floor(a / 10); //cần hàm floor bởi vì JS ko phân biệt int và float, nó ko tự động bỏ phần dư khi chia 10 //ko thể chỉ mỗi a /= 10; như c++
  }
  console.log(true);
};

IsGoodNum(2013); //true
IsGoodNum(2012); //false

//7. changTime: đổi định dạng thời gian 0:0:00 -> 00:00:00
let time = "0:00:00";
const changeTime = (time) => {
  if (time.split(":")[0] < 10) {
    return "0" + time;
  }
  return time;
};

console.log(changeTime("5:30:00")); //05:30:00
console.log(changeTime("12:50:00")); //12:50:00

//8. xoá số trùng nhau. 2TH: lộn xộn và đã sort
let a = [1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 1, 1];

let DeleteDupli = (a) => {
  //trường hợp đã sort
  // for(let i = 0; i < a.length - 1; i++){
  //     while(a[i] === a[i + 1]){
  //         a.splice(i + 1, 1);
  //     }
  // }

  for (let i = 0; i < a.length - 1; i++) {
    for (let j = i + 1; j < a.length; j++) {
      if (a[i] === a[j]) {
        a.splice(j, 1);
        j--;
      }
    }
  }
  return a;
};
console.log(DeleteDupli(a));

//9. đổi tất cả chữ b thành dấu + (tương tự làm tất cả chữ b thành B).
let initialString = "hello baby cute";

let changeStr = (str) => {
  arr = str.split("");
  // return arr.map((val) => {
  //     return (val === "b")? "+" : val;
  // }).join("");

  // return arr.reduce((acc, val) => {
  //     return (val === "b") ? acc += "+" : acc += val;
  // }, "");

  //cách 3
  return str.split("b").join("+");
  //
};

console.log(changeStr(initialString));

//ghi hoa tất cả chữ b siêu nhanh
let s = "abcabc";
console.log(s.split("b").join("b".toUpperCase()));

//10. tìm số lớn nhất trong mảng.
let arrB10 = [1, 23, 4, 56, 9];
let maxB10 = arrB10.reduce((acc, val) => {
  return Math.max(acc, val);
});
console.log(maxB10);

//11. ktra xem 1 số có đối xứng ko?
const palindromic = (str) => {
  return str == str.split("").reverse().join("") ? true : false;
};
console.log(palindromic("123"));
console.log(palindromic("131"));
