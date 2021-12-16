//destructuring
//đã chụp hình, xem file Destrucering.png để biết full kiến thức về cái này
let user = {
  name: "user1",
  age: 20,
};

console.log(user.name);
console.log(`hello, ${user.name}`);

// cách 1
let name1 = user.name;
console.log(name1);

//cách 2
let { name: name, age: age } = {
  name: "user1",
  age: 20,
};

//trong js, key bằng value thì có thể lược bỏ
let { name, age } = user;
console.log(name);

let staff = {
  name: "user1",
  age: 20,
  gender: "male",
  isActive: false,
};

let { name, age, gender, isActive, bienBiDu } = staff;

console.log(
  `${name} is ${age}, gender is ${gender}, status is ${
    isActive ? "active" : "not active"
  }`
);
console.log(bienBiDu); //-> undefined, y chang -> let a; log(a);

//-------------đối với ARRAY
let users = ["Lưu", "Trần", "18"];
let [firstName, lastName, age] = users;
console.log(firstName, lastName, age);

//cách hay để swap cho lẹ
let x = 5;
let y = 10;
[y, x] = [x, y];
console.log(x); // => 10
console.log(y); // => 5

let emp = {
  address: {
    number: 20,
    district: "quận 9",
  },
  ageEmp: 18,
};

let {
  address: { district },
  ageEmp,
} = emp;
//console.log(address); // lỗi vì address ko thể là biến
console.log(district);
console.log(ageEmp);

//cách 2 hiện ra district
let { district } = emp.address;
console.log(district);
