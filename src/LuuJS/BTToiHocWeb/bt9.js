function solution(input) {
    /*
    Tính tổng budget của của user❤️
    */
    let totalBudget = input.reduce((acc, val, index) => {
        //val.budget === undefined ? "do nothing" : acc += val.budget; //cách 1
        "budget" in val ? acc += val.budget : "do nothing"; //cách 2
        return acc;
    }, 0);
        //return input.reduce((acc, val) => val.budget ? acc + val.budget : acc, 0); //cách 3
    return totalBudget;
}