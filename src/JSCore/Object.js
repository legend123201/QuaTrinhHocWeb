/* 
Những dòng này cũng có trong file typeOf.js
All JavaScript values, except primitives, are objects.

Booleans can be objects (if defined with the new keyword)
Numbers can be objects (if defined with the new keyword)
Strings can be objects (if defined with the new keyword)
Dates are always objects
Maths are always objects
Regular expressions are always objects
Arrays are always objects
Functions are always objects
Objects are always objects
*/

//object
//Objects are mutable: They are addressed by reference, not by value.
//key-value
let user = {
  name: "Maria ozaha",
  age: 18,
  1: 3,
  1: 5,
};

console.log(user.name);
console.log(user.age);
//console.log(user.1); //-> lỗi
//console.log(user."1"); //-> lỗi
console.log(user["name"]);
console.log(user["age"]);
console.log(user[1]); //->5
console.log(user["1"]); //->5
console.log(user[2]); //-> undefined
//trường hợp key là string có thể biến thành số thì dùng key chuỗi hay key số đều là 1, ở trên có 2 cái key đều có thể mang ý nghĩa là 1, thì giá trị nó lấy cái cuối cùng xuất hiện
//thầy Nhất said: key là số thì tự động biến thành chuỗi

//object có thể duyệt qua các key hoặc value của nó bằng for...in loop
var person = {
  fname: "John",
  lname: "Doe",
  age: 25,
  fullName: function () {
    return this.firstName + " " + this.lastName;
  },
};
let txt = "";
for (x in person) {
  //x là key, person[x] là giá trị của key đó
  txt += person[x];
}
console.log(txt); //-> John Doe 25

//có thể tạo thêm Properties và xoá Properties cho object chỉ định (chuyên sâu thì tìm ko thì thôi: nếu xoá Properties của objects prototype thì tất cả các objects sẽ mất Properties đó)
//thêm (nhưng lưu ý 1 điều, là thêm như này thì cái contructor object mình tạo (nếu có) thì nó ko tự thêm, tại là mình tự tạo constructor đó mà, chỉ object chỉ định mới có cái Properties mới thêm đó)
person.nationality = "English";
console.log(person); //-> {fname:"John", lname:"Doe", age:25, nationality:"English"}
//xoá
delete person.age;
console.log(person); //-> {fname:"John", lname:"Doe", nationality:"English"}

//methods trong objects
var aGirl = {
  firstName: "Lacy",
  lastName: "King",
  age: 28,
  fullName: function () {
    return this.firstName + " " + this.lastName;
  },
};
console.log(aGirl.fullName()); //-> Lacy King
//add methods vào đc luôn
aGirl.newFunc = function () {
  console.log("i am a new func");
};
aGirl.newFunc(); //i am a new func

//biến objects thành array
var person2 = { name: "John", age: 30, city: "New York" };
var myArray = Object.values(person2);
console.log(myArray); //-> [ 'John', 30, 'New York' ]

//biến objects thành string
var myString = JSON.stringify(person2); //cách 2: var myString = String(person2)
console.log(myString); //-> {"name":"John","age":30,"city":"New York"}

var testObj = { a: 1, a: 2, b: 3, c: 4, b: 5 };
console.log(testObj); //-> { a: 2, b: 5, c: 4 } (bị trùng thì nó lấy cái cuối xuất hiện, giống y chang trường hợp 1 và "1" đầu tiên)

//-------------------3 cách để kiểm tra xem object có thuộc tính nào đó hay ko
/*
cách 1: 
const hero = {
  name: 'Batman'
};

hero.hasOwnProperty('name');     // => true
hero.hasOwnProperty('realName'); // => false

cách 2: 
const hero = {
  name: 'Batman'
};

'name' in hero;     // => true
'realName' in hero; // => false

cách 3:
const hero = {
  name: 'Batman'
};

hero.name;     // => 'Batman'
hero.realName; // => undefined
*/

//NGOÀI RA: còn có constructor, getter, setter, prototype để thêm properties cho constructor, và nhiều hàm có sẵn như isFrozen(),...
//đụng tới thì tìm hiểu thêm

/*
//BÀI TẬP về objects
//những hàm phía dưới là array method

users = [
    {
        name: "User1",
        age: 18,
        gender: "male"
    },
    {
        name: "User2",
        age: 20,
        gender: "male"
    }, {
        name: "User3",
        age: 30,
        gender: "female"
    },
];
console.log(users);

//in ra những user có tuổi 20 và là phụ nữ

const newUsers = users.filter((val, index) => {
    return val.age >= 20 && val.gender === "female";
});
console.log(newUsers);

let userSpecified = users.find(i => i.name == "User2");
console.log(userSpecified.age);
let indexUserSpecified = users.findIndex(i => i.name == "User2");
console.log(indexUserSpecified);
*/
