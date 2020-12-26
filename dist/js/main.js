document.getElementsByClassName("baby")[0].style.color = "red";
document.getElementsByClassName("baby")[1].style.backgroundColor = "red";


//thêm class vào 1 cái gì đó
document.getElementsByClassName("baby")[1].classList.add("format-text"); 
document.getElementsByClassName("baby")[1].classList.remove("cute"); 



document.getElementsByClassName("clickme")[0].addEventListener("click",() => {
    let height = document.getElementById("yourheight").value;
    /*
    alert(`Chieu cao la ${height}`);
    if(height > 10){
        console.log("true");
    }else{
        console.log("false");
    }
    */
   document.querySelectorAll(".hello h2")[0].textContent = `<p>Chieu dai cua ban la: ${height}cm</p>`;
   
});

document.querySelectorAll(".hello button")[1].addEventListener("click", ()=>{
    let pw = document.querySelectorAll("input")[1].value;
    document.getElementById("pw").textContent = `${pw}`;//truong hop nay ko tra ve array
    console.log(pw);
});



