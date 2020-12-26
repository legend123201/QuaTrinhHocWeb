function solution(input) {
    /*
    Viết chương trình kiểm tra bàn phím có hư hay không
    👍 Input gồm mảng có 2 phần tử 
    💋 + Phần tử đầu là string đúng
    💋 + Phần tử sau là string sai
    In ra phím bị hư
    */
    let arr = input[0].filter((val, index) => {
        return val !== input[1][index];
    });
    let output = arr.filter((val, index) => {
        return index === arr.indexOf(val); 
    });
    return output;
}