/*
LÝ THUYẾT
//thêm và xoá class của 1 cái gì đó
//chỉnh sửa css của 1 cái gì đó
//thêm sự kiện: click

//querySelectorAll() là hàm có thể làm đc tất cả tác dụng của get...byId, ...byClass, ...byTagname,.... Mấy cái kia thì nó tường minh hơn thôi
//trừ document.getElementById("") trả về 1 object thì các cái còn lại trả về 1 array


document.getElementsByClassName("baby")[0].style.color = "red";
document.getElementsByClassName("baby")[1].style.backgroundColor = "red";


//thêm class vào 1 cái gì đó
document.getElementsByClassName("baby")[1].classList.add("format-text"); 
document.getElementsByClassName("baby")[1].classList.remove("cute"); 


document.getElementsByClassName("clickme")[0].addEventListener("click",() => {
    let height = document.getElementById("yourheight").value;
   document.querySelectorAll(".hello h2")[0].textContent = `<p>Chieu dai cua ban la: ${height}cm</p>`;
   
});

document.querySelectorAll(".hello button")[1].addEventListener("click", ()=>{
    let pw = document.querySelectorAll("input")[1].value;
    document.getElementById("pw").textContent = `${pw}`;//truong hop nay ko tra ve array
    console.log(pw);
});
*/


let CheckSpecialChar = (s) => {
    let check = s.split("").filter((val, index) => {
        return (val < "a" || val > "z") && (val < "A" || val > "Z") && (val < "0" || val > "9");
    });
    return check.length === 0 ? true : false;
};

document.querySelectorAll("button")[0].addEventListener("click", () => {
    let username = document.querySelectorAll("#username")[0].value;
    let password = document.querySelectorAll("#password")[0].value;
    let numEror = 0;
    
    if (username.length <= 6) {
        document.querySelectorAll("#usernameEror")[0].textContent = "Độ dài username phải từ 6 kí tự trở lên!";
        numEror++;
    }else{
        document.querySelectorAll("#usernameEror")[0].textContent = "";
    }

    if (password.length < 5 || password.length > 15 || CheckSpecialChar(password) === false) {
        document.querySelectorAll("#passwordEror")[0].textContent = "Độ dài password phải từ 5 đến 15 kí tự, không chứa kí tự đặc biệt!";
        numEror++;
    }else{
        document.querySelectorAll("#passwordEror")[0].textContent = "";
    }

    if (numEror === 0) {
        alert("Login success!");
        loginSuccess = true;
    }
});

//để tránh load lại form
document.getElementsByClassName("form")[0].addEventListener('submit', (e) =>{
    e.preventDefault();
});