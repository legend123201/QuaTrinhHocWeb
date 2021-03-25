//https://viblo.asia/p/three-dots-da-thay-doi-javascript-nhu-the-nao-QpmlenBr5rd
//three dot trong js thì có cái lợi ích: rest operator, spread operator. 2 cái này bản chất cũng là như nhau.

/*
let user = {name: 1};
let arr = [1,2,3];

console.log(...user); //lỗi Found non-callable @@iterator
console.log(...arr); //lỗi Found non-callable @@iterator
//nó ko phải là array hay object gì cả, nó là 1 thứ gì đó mà liệt kê tất cả các phần tử của chúng ta. vd: 1,2,3 (ko có {} hay [] gì hết)
//cũng ko typeof đc
console.log(typeof(...user)); //lỗi
*/

//-------------------------------rest operator-------------------------------
function display(a, b, ...args) {
    console.log("a = " + a + "; b = " + b + "; and the rest: " + args);
    //console.log(args); //-> nó ra array 
    //console.log(typeof(args)); //-> object (hợp lý vì array có typeof là object)
    //console.log(typeof(...args)); //NOTE: ko typeof đc, bởi vì nó ko phải là array hay object gì cả, nó là 1 thứ gì đó mà liệt kê tất cả các phần tử của chúng ta. vd: 1,2,3 (ko có {} hay [] gì hết)
}
display('welcome', 'to', 'Earth', 1, 1, "abc"); //-> a = welcome; b = to; and the rest: Earth,1,1,abc
display('welcome', 'to', 'Earth', 1, null);// -> a = welcome; b = to; and the rest: Earth,1, (phần cuối rỗng vì nó là null, null ép kiểu sang string là rỗng)
display('welcome', 'to', 'Earth', 1, undefined);//-> a = welcome; b = to; and the rest: Earth,1,
display('welcome', 'to', 'Earth', 1, { user: 1 });//-> a = welcome; b = to; and the rest: Earth,1,[object Object] (tại trên kia cái log ép kiểu về string nên ko xuất ra đc object như dòng ngay bên dưới)
console.log({ user: 1 }); //-> { user: 1 } (cái này ko phải là string)


//-------------------------------------spread operator----------------------------
//xài cho 2 cái này thì mới là spread operator: [], {} => reference type
//đây là cách nhanh nhất để copy arr và object, và nhanh nhất để nối array vì array ko có hàm concat như của string
//và cũng là nhanh nhất để tạo new object bằng constructor cho objects nếu như params mình để trong 1 cái array sẵn rồi, và dùng hàm max cho array cũng dùng cái này vì hàm max ko dùng cho array đc 

//trong trường hợp này thì nó vẫn là rest, xài trên hàm như này thì nó là rest, ko có a và b thì nó lấy hết thôi
function display(...args) {
    console.log(args);
}
display('welcome', 'to', 'Earth', 1, 1, "abc"); //-> [ 'welcome', 'to', 'Earth', 1, 1, 'abc' ]

//----dùng tách arr thành các ptu-----start
const number = [1,2,3];
const addNumbers = (a,b,c) => {
    return a + b + c;
};
console.log(addNumbers(...number));//-> 6
const copyNumber2 = [...number, 22];
console.log(copyNumber2); //-> [ 1, 2, 3, 22 ]
//----dùng tách arr thành các ptu-----end

//-----dùng tách user thành các phần tử---start
const user = {
    name: "user 1",
    id: 2
};
const copyUser = {...user, age: 10, gender: "female"};
console.log(user);//-> { name: 'user 1', id: 2 }
console.log(copyUser);//-> { name: 'user 1', id: 2, age: 10, gender: 'female' }
//-----dùng tách user thành các phần tử---end

let cold = ['autumn', 'winter'];  
let warm = ['spring', 'summer'];
cold.push(...warm);  
console.log(cold);//-> [ 'autumn', 'winter', 'spring', 'summer' ]