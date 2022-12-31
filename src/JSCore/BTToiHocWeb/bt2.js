
function solution(input) {
    /*
    Tính tổng các chữ số
    Ví dụ: 136 => 1 + 3 + 6 = 10
    */

    if (input < 0) {
        return "Invalid input";
    }
    input = input.toString().split("");
    let tong = input.reduce((acc, val) => {
        {
            return acc + Number(val);
        }
    }, 0);
    return tong;
}