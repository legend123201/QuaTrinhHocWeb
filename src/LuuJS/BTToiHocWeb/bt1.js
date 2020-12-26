
function solution(input) {
  /*
  Đổi in hoa thành in thường và ngược lại
  */
  if (input.trim() === "") {
    return "empty string";
  }
  input = input.split("");
  let output = "";
  input.forEach(t => {
    if (t >= "A" && t <= "Z") {
      output += t.toLowerCase();
    } else {
      output += t.toUpperCase();
    }

  });
  return output;
}

/*
//bài 1 hồi xưa
function solution(input) {
  
  //Tìm số lớn nhất trong mảng
let max = input[0];
for (let i = 1; i < input.length; i++) {
  if (max < input[i]) {
    max = input[i];
  }
}
return max;
}

// function solution(input){
//     return Math.max.apply(null, input); //cách này thì chỉ trả về number
// }
*/