function solution(input) {
    /*
    Giả sử input là 1 password của 1 user
    Tạo chuỗi gồm kí tự đầu và cuối của password ban đầu
    Các kí tự còn lại dược thay bằng dấu *
    */

    let size = input.length;

    if (size <= 2) {
        return "*".repeat(size);
    }

    let output = input[0] + "*".repeat(size - 2) + input[size - 1];
    return output;
}