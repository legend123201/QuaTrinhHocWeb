//destructuring 

let user = {
    name: "user1",
    age: 20
};

console.log(user.name);
console.log(`hello, ${user.name}`);

// cách 1
/*
let name = user.name;
console.log(name1);
*/

//cách 2
/*
let {name: name, age: age} = {
    name: "user1", 
    age: 20
}
*/
//trong js, key bằng value thì có thể lược bỏ
/*
let {name, age} = user;

console.log(name);
*/
let staff = {
    name: "user1",
    age: 20,
    gender: "male",
    isActive: false,
};

let { name, age, gender, isActive, bienBiDu } = staff;

console.log(`${name} is ${age}, gender is ${gender}, status is ${isActive ? "active" : "not active"}`);
console.log(bienBiDu); //-> undefined, y chang -> let a; log(a);

//đối với array
let users = ["user 1", "user 2", "user 3"];
let [user1, user2, user3] = users;
console.log(user1, user2, user3);

let t = "abc";
console.log(t.replace("a", "b"));
console.log(t);//ko thay đổi

let emp = {
    address: {
        number: 20,
        district: "quận 9",
    },
    ageEmp: 18,
}

let {address : {district}, ageEmp} = emp;
//console.log(address); // lỗi vì address ko thể là biến
console.log(district);
console.log(ageEmp);

//cách 2 hiện ra district
let {district} = emp.address;
console.log(district);