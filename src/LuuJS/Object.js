//object
//key-value
let user = {
    name: "Maria ozaha",
    age: 18,
    "1": 3,
    1: 5
};

console.log(user.name);
console.log(user.age);
console.log(user['name']);
console.log(user['age']);
console.log(user[1]); //->5
console.log(user["1"]);//->5
//trường hợp key là string có thể biến thành số thì dùng key chuỗi hay key số đều là 1, ở trên có 2 cái key đều có thể mang ý nghĩa là 1, thì giá trị nó lấy cái cuối cùng xuất hiện
//thầy Nhất said: key là số thì tự động biến thành chuỗi 

console.log(user[2]); //-> undefined

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