
function solution(input) {
    /*
    Định dạng lại string theo quy ước sau:
    *Chữ cái đầu của mỗi từ phải viết hoa
    *Các chữ cái còn lại của từ đó phải viết  thường
    Ví dụ:
    Input: "hello worlD"
    output: "Hello World"
    */
    if (input.length === 0) {
        return "";
    }
    input = input.toLowerCase();
    input = input.split("");
    input[0] = input[0].toUpperCase();
    for(let i = 1; i < input.length; i++){
        if(input[i - 1] === " "){
            input[i] = input[i].toUpperCase();
        }
    }
    return input.join("");
}