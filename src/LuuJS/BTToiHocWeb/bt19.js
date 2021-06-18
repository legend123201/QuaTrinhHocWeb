function solution(input) {
    /*
    Trò chơi nối từ như sau:
    Những từ cuối của phần tử trước là từ đầu của phần tử sau:
    Ví dụ: 
    ["hello", "lon"] -> "hellon"
    ["hello", "lon", "on", "name"] -> "helloname"
    */
    let output = input[0];
    for (let i = 0; i < input.length - 1; i++) {
        indexBatDauStr1 = input[i].lastIndexOf(input[i + 1][0]); //tìm "điểm bắt đầu str2" trong str1
        output += input[i + 1].slice(input[i].length - 1 - indexBatDauStr1 + 1); //cho output cộng với str2 từ vị trí mà str2 ko trùng str1
    }
    return output;
}

let arr = ["oven", "envier", "erase", "serious"];
console.log(solution(arr));

//cách 2
function solution(input) {
    return output = input.reduce((acc, val) => {
        return acc + val.slice(acc.length - acc.lastIndexOf(val[0]));
    });
}