function solution(input) {
    /*
    Sắp xếp mảng theo thứ tự tăng dần
    Lưu ý: không áp dụng cho string
    */
    let input2 = input.filter((val) => { return (typeof (val) === "number") });
    return input2.sort((a, b) => { return a - b });
}