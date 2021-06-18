//nên dùng hàm .every() để cải tiến
function solution(input) {
    /*
    Xác định input có phải là 1 "special array" hay không
    "special array" được định nghĩa là:
    + giá trị tại vị trí index chẳn sẽ là số chẳn
    + giá trị tại vị trí index lẽ sẽ là số lẽ
    */
    // for(let i = 0; i < input.length; i+=2){
    //     if(input[i] % 2 === 1){
    //         return false;
    //     }
    //     if(input[i + 1] % 2 === 0){
    //         return false;
    //     }
    // }
    // return true;
    
    //số âm thì ko phải số chẵn hay lẻ
    //length = 0 thì false
    if (input.length === 0) {
        return false;
    }
    let newArr = input.map((val, index) => {
        if (val < 0) {
            return false;
        }
        return ((val + index) % 2 === 0);
    });
    let newArr2 = newArr.filter((val, index) => {
        return val === false;
    });
    if (newArr2.length === 0) {
        return true;
    }
    return false;
}