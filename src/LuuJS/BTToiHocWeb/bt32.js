function solution(input) {
    /*
    Tìm số lớn nhất có thể, từ các phần tử trong mảng.
    */
    return Number(input.sort((a, b) => b - a).join(""));
}