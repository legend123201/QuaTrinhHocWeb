document.getElementsByTagName("main")[0].style.display = "none";
document.getElementById("messageEror").style.display = "none";
document.getElementsByClassName("choose-date-time")[0].style.display = "none";
document.getElementsByClassName("button")[0].style.display = "none";

//hàm request làm cho tất cả sinh viên đều chưa điểm danh
function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

//lấy ngày và giờ để điểm danh
document.getElementById("start").addEventListener("click", () => {
    //console.log(typeof document.getElementById("dateInput").value); -> string ngày/tháng/năm
    //console.log(typeof document.getElementById("appt").value); -> string giờ(0->23)/phút 

    let dateStr = document.getElementById("dateInput").value.split("-").reverse().join("/"); //lấy giá trị, split nó ra 1 cái mảng bằng dấu "-" vì nó đang phân cách nhau bỏi dấu đó, rồi đảo ngược mảng, rồi biến nó thành 1 string cách nhau bỏi "/"
    let timeStr = document.getElementById("appt").value.split(":").join("/");
    if (timeStr.length == 0) {
        console.log("Chưa nhập giờ!");
        document.getElementById("messageEror").style.display = "block";
        return;
    }

    console.log(dateStr + "/" + timeStr);

    firebase.database().ref('isDangNhap/').set(1);
    firebase.database().ref('DateAndTime/').set(dateStr + "/" + timeStr);
    document.getElementsByTagName("main")[0].style.display = "flex";
    document.getElementsByClassName("choose-date-time")[0].style.display = "none";
    document.getElementsByClassName("button")[0].style.display = "none";
    httpGet("https://checkin-ptit.herokuapp.com/api/database/reload");
});


let idTable = "DSSV";
//tạo hàng <tr> có id là tr vào cái table có id là DSSV
let tr;
tr = document.createElement("tr");
tr.setAttribute("id", "tr");
document.getElementById(idTable).appendChild(tr);

//tạo hàng table header cho <tr> có id là tr
let th, thText;
let arr_thText = ["Mã sinh viên", "Họ", "Tên", "Điểm danh"];

for (let i = 0; i < arr_thText.length; i++) {
    th = document.createElement("th"); //tạo <th>
    thText = document.createTextNode(arr_thText[i]); //tạo nội dung
    th.appendChild(thText); //cho nội dung vào <th>
    document.getElementById("tr").appendChild(th); //cho <th> vào <tr>
}

let arrAlertSuccess = [];
let AdminAcc;
let isDangNhap;

//hàm (block) này chỉ chạy khi database bị thay đổi
firebase.database().ref().on('value', function (snapshot) {
    
    AdminAcc = snapshot.val().AdminAcc;
    isDangNhap = snapshot.val().isDangNhap;
    if(isDangNhap == 0){
        document.getElementsByTagName("main")[0].style.display = "none";
    }else{
        document.getElementsByTagName("main")[0].style.display = "flex";
    }

    let arr = snapshot.val().UIS.Students;
    console.log(arr);
    //ko đc để hàm vẽ data table (hàm for này) ở ngoài block này, bởi vì nếu thêm mới thì nó ko tự vẽ thêm, phải bỏ trong block này vì block này sẽ chạy khi db thay đổi
    for (const [key, value] of Object.entries(arr)) {
        //nếu đã vẽ id này rồi thì ko cần vẽ nữa
        if (document.getElementById(`tr${value.MSSV}`) !== null) {

        }
        else {
            //tạo <tr>
            tr = document.createElement("tr");
            tr.setAttribute("id", `tr${value.MSSV}`); //id mỗi hàng phải khác nhau, để cho dữ liệu vào đúng hàng
            document.getElementById(idTable).appendChild(tr);

            //tạo 1 cái <td> trong <tr>
            th = document.createElement("td"); //tạo <td>
            th.setAttribute("id", `td${value.MSSV}0`); //id mỗi data phải khác nhau để cho dữ liệu đúng chỗ
            document.getElementById(`tr${value.MSSV}`).appendChild(th); //cho <td> vào <tr>

            //tương tự với 3 cái còn lại
            th = document.createElement("td"); //tạo <td>
            th.setAttribute("id", `td${value.MSSV}1`);//id mỗi data phải khác nhau để cho dữ liệu đúng chỗ
            document.getElementById(`tr${value.MSSV}`).appendChild(th); //cho <td> vào <tr>

            th = document.createElement("td"); //tạo <td>
            th.setAttribute("id", `td${value.MSSV}2`);//id mỗi data phải khác nhau để cho dữ liệu đúng chỗ
            document.getElementById(`tr${value.MSSV}`).appendChild(th); //cho <td> vào <tr>

            th = document.createElement("td"); //tạo <td>
            th.setAttribute("id", `td${value.MSSV}3`);//id mỗi data phải khác nhau để cho dữ liệu đúng chỗ
            document.getElementById(`tr${value.MSSV}`).appendChild(th); //cho <td> vào <tr>


        }

        document.getElementById(`td${value.MSSV}0`).innerHTML = value.MSSV;
        document.getElementById(`td${value.MSSV}1`).innerHTML = value.ho;
        document.getElementById(`td${value.MSSV}2`).innerHTML = value.ten;
        //document.getElementById(`td${i}3`).innerHTML = arrCars[i].name;
        if (value.diemDanh == 1) {
            document.getElementById(`td${value.MSSV}3`).innerHTML = '<i class="fas fa-check-circle yes-tick"></i>';

            console.log(value.MSSV);
            console.log(typeof (arrAlertSuccess[value.MSSV]));

            //hiện thông báo điểm danh thành công nếu như nó chưa thông báo
            if (arrAlertSuccess[value.MSSV] != 1) {
                console.log("tada");
                //alert 1s
                document.getElementsByClassName("show-alert")[0].innerHTML = `<div class="alert alert-success" style="text-align: center;" role="alert">  <strong>Success!</strong> ${value.MSSV} đã điểm danh!</div>`;
                window.setTimeout(function () {
                    $(".alert").fadeTo(500, 0)
                }, 5000);
                arrAlertSuccess[value.MSSV] = 1;
            }

        } else if (value.diemDanh == 2) {
            document.getElementById(`td${value.MSSV}3`).innerHTML = '<i class="fas fa-check-square late-tick"></i>';
        }
        else {
            document.getElementById(`td${value.MSSV}3`).innerHTML = '<i class="fas fa-times-circle no-tick"></i>';
        }
    }
});

$(".btn-login").click(function (e) {
    e.preventDefault();
    //$(".modal").show(); // bằng với display: block
    $(".modal").fadeIn(); // bằng với display: block + opacity dần dần
    $(".modal").click(function (e) {
        e.preventDefault();
        //$(".modal").hide();
        $(".modal").fadeOut();
    });
});
$(".modal-content").click(function (e) {
    e.preventDefault();
    e.stopPropagation(); //ngăn sự lan truyền của cùng một sự kiện được gọi
});


$(".DangNhap").click(function (e) {
    e.preventDefault();
    let txtLogin = $("#txtLogin").val();
    let txtPassword = $("#txtPassword").val();
    console.log();
    if (txtLogin == Object.keys(AdminAcc)[0] && txtPassword == Object.values(AdminAcc)[0]) {
        
        document.getElementsByClassName("choose-date-time")[0].style.display = "flex";
        document.getElementsByClassName("button")[0].style.display = "flex";
        $(".modal").fadeOut();
    }else{
        alert("Tài khoản, mật khẩu không hợp lệ!");
    }
});

$(".Thoat").click(function (e) {
    e.preventDefault();
    $(".modal").fadeOut();
});