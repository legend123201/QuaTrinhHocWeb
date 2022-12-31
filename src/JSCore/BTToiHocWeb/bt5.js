function solution(input) {
    /*
    Tính số lần xuất hiện của các phần tử trong mảng
    Xuất dữ liệu thành 1 object
    Ví dụ: input = [2,4,6,4,4] -> output = {"2": 1, "4": 3, "6":1}
    */
    let output = input.reduce((total, val, index, { }) => {
        val in total ? total[val] += 1 : total[val] = 1;
        return total;
    }, {});
    return output;
}


console.log(solution([2,4,6,4,4]));