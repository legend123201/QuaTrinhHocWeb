input = ["1a","a","2b","b"];
function solution(input) {
    /*
    In ra mảng các phần tử có chứa Number 😢
    */
   if(input.length === 0){
       return [];
   }
   let output = [];
   for(let i = 0; i < input.length; i++){
       for(let j = 0; j <=9;j++){
           if(input[i].includes(j.toString())){
               output.push(input[i]);
               break;
           }
       }
   }
   return output;
}
console.log(solution(input));