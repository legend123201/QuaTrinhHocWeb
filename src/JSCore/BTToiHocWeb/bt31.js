let input = [{ "name": "trang", "age": 18, "gender": "female" }, { "name": "thuan", "age": 18, "gender": "male" }, { "name": "nhi", "age": 19, "gender": "female" }, { "name": "nghia", "age": 18, "gender": "male" }, { "name": "thong", "age": 17, "gender": "male" }, { "name": "hang", "age": 35, "gender": "female" }, { "name": "hang", "age": 28, "gender": "female" }];

function solution(input) {
    /*
    * Tính phần trăm user có gender là "female" và có độ tuổi từ 18 -> 25
    * Trường hợp % không phải số nguyên thì làm tròn xuống
    * ví dụ: 69.6969% ~ 69%
    */
    // let numUsers = 0;
    // for (let i = 0; i < input.length; i++) {
    //     if (input[i].gender === "female" && input[i].age >= 18 && input[i].age <= 25) {
    //         numUsers++;
    //     }
    // }

    let newArr = input.filter((val, index) => {
        return val.gender === "female" && val.age >= 18 && val.age <= 25;
    });
    return (Math.floor((newArr.length / input.length) * 100) + "%");
}
console.log(solution(input));