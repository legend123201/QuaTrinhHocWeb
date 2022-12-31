input = ["hello", "Hello", "hellO", "HELLO"];

function solution(input) {
    /*
    So sánh các string trong mảng có giống nhau hay không
    Không phân biệt hoa thường
    */

    if (input.length === 0) {
        return false;
    }
    for (let i = 0; i < input.length - 1; i++) {
        if (input[i].toUpperCase() !== input[i + 1].toUpperCase()) {
            return false;
        }
    }
    return true;
}

console.log(solution(input));