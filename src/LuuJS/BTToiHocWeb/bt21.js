function solution(input) {
    /*
    Cắt chuỗi đã cho dựa vào số lượng kí tự cần cắt
    Ví dụ:
    input: ["hello", 1] 
    output: ["h","e","l","l","o"]
    */
   
    /* //cách c++
    let arrString = input[0].split("");
    let cutLength = input[1];
    let output = [];
    let temp = "";
    for (let i = 0; i < arrString.length; i++) {
        arrString[i] === " " ? "" : temp += arrString[i];
        if (temp.length === cutLength || i === arrString.length - 1) {
            output.push(temp);
            temp = "";
        }
    }
    return output;
    */


    let arrString = input[0].split("");
    let cutLength = input[1];
    let output = [];

    //console.log(typeof(arrString[0]));
    arrString.reduce((acc, val, index) => {
        val === " " ? "" : acc += val;
        if (acc.length === cutLength || index === arrString.length - 1) {
            output.push(acc);
            acc = "";
        }
        return acc;
    }, "");
    return output;
}

let input = ["hello", 2];
console.log(solution(input));