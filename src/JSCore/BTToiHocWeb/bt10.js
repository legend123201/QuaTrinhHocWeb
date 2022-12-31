
function solution(input) {
    /*
    Định dạng lại string theo quy ước sau:
    *Chữ cái đầu của mỗi từ phải viết hoa
    *Các chữ cái còn lại của từ đó phải viết  thường
    Ví dụ:
    Input: "hello worlD"
    output: "Hello World"
    */
    if (input == "") {
        return "";
    } else {
        let x = input.toLowerCase().split(' ');
        let a = x.map((value) => {
            return value[0].toUpperCase() + value.slice(1);
        })
        return a.join(' ');
    }
}