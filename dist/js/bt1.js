function solution(input){
    /*
    Tìm số lớn nhất trong mảng
    */
    let max = input[0];
    for(let i = 1; i < input.length; i++){
      if(max < input[i]){
        max = input[i];
      }
    }
    return max;
}

// function solution(input){
//     return Math.max.apply(null, input); //cách này thì chỉ trả về number
// }