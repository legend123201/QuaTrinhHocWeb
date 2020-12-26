function solution(input) {
    /*
    Tính số lần xuất hiện của các phần tử trong mảng
    Xuất dữ liệu thành 1 object
    Ví dụ: input = [2,4,6,4,4] -> output = {"2": 1, "4": 3, "6":1}
    */
    let output = input.reduce((acc, val, index, { }) => {
        // if(val in acc){
        //     acc[val] += 1;
        // }
        // else{
        //     acc[val] = 1;
        // }
        val in acc ? acc[val] += 1 : acc[val] = 1;
        return acc;
    }, {});
    return output;
}