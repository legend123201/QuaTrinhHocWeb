let a = ["happy birthday","hawwy birthday"];

function solution(input) {
    /*
    Viết chương trình kiểm tra bàn phím có hư hay không
    👍 Input gồm mảng có 2 phần tử 
    💋 + Phần tử đầu là string đúng
    💋 + Phần tử sau là string sai
    In ra phím bị hư
    */
    let arr1 = input[0].split("");
    let arr2 = input[1].split("");
    let output = "";
    
    arr1.forEach((val, index) => {
        if(val != arr2[index])
            if (!output.includes(val))
                output += val;
    });
    return output.split("");
}

console.log(solution(a));