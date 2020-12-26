//let a = 2;
//CRUD Application (create - read - update - delete)
$(function () {
    /*
    $("button").click(function (e) { 
        e.preventDefault();
        alert($(".email").val()); //lấy giá trị ô input
    });
    
    //----------------tính tong
    //phím tắt jqueryClick
    $("#bt1").click(function (e) {
        e.preventDefault();
        alert(Number($(".numberA").val()) + Number($(".numberB").val()));
    });

    //TODO JQUERY
    //load dữ liệu từ jquery ra html
    const users = [
        {
            name: "user1"
        },
        {
            name: "user2"
        }
    ];

    //jqTextSet
    //$(".user1").text(users[0].name);
    $(".user2").text(users[1].name);
    console.log($(".user1").text());
    */

    //kiểm tra localStorage có todos chưa
    //JSON.parse là dđể biến string thành array lại, nếu như ko có todos thì cái parse nó sẽ trả về rỗng, thì là false thì nó chạy cái sau ||, vì || là "đi tìm true"
    const todos = JSON.parse(localStorage.getItem("todos")) || [
        {
            id: 1,
            content: "Shopping",
            isDone: true
        },
        {
            id: 2,
            content: "Having dinner with GF",
            isDone: false
        },
        {
            id: 3,
            content: "Laundry",
            isDone: false
        },
        {
            id: 4,
            content: "Playing game with buddy",
            isDone: true
        }
    ];


    let selectedTodo = null;

    renderTodos(todos);

    //add nội dung vào list
    $(".add-todo").click(function (e) {
        e.preventDefault();
        let inputValue = $("input.todo").val();
        //nếu input value ko rỗng
        if (inputValue) {
            //nếu selectedTodo ko null thì là chúc năng update đang chạy
            if (selectedTodo) {
                selectedTodo.content = inputValue;
                //ở đây arr của mình là 1 object, nên selectedTodo là con trỏ trỏ tới chỉ vị trí đó nên sửa thì object trong arr cũng update lun
                //nhưng nếu ko phải object thì làm như sau
                //let index = todos.findIndex(val => val.id === selectedTodo.id);
                //todos.splice(index, 1, selectedTodo);

                selectedTodo = null;
            }
            else {
                todos.unshift({
                    id: Math.floor( Math.random()*1000 + 100), //làm tròn số thập phân tới 2 chữ số sau dấu ","
                    content: inputValue,
                    isDone: false
                });
            }

            //lưu vào localStorage
            //JSON.stringify chuyển object (arr cũng là object) thành string
            localStorage.setItem("todos", JSON.stringify(todos));

            renderTodos(todos);
        }
        else {
            alert("Input is empty!");
        }

    });

    //ko dùng đc khối lệnh như này, vì lệnh $(selector).sth nghĩa là add 1 cái gì đó cho những selector "có sẵn"
    //khi render thì nó đã vô tình xoá đi các "span có sự kiện click", tạo ra các span ko có sự kiện click
    // $(".btn-delete").click(function (e) { 
    //     e.preventDefault();
    //     //có nhiều cái span thì "this" để trỏ vào cái span đang đc click
    //     let id = $(this).data("todoid");
    //     //tìm vị trí xuất hiện đầu tiên của thằng có id mà muốn delete
    //     let index = todos .findIndex((val)=> val.id === id);
    //     todos.splice(index, 1);
    //     renderTodos(todos);
    // });

    //khối lệnh này ok vì todo-list "có sẵn" và ko bị xoá đi, bất cứ cái nào có .btn-delete trong nó sẽ có sự kiện click
    $(".todo-list").on("click", ".btn-delete", function (e) {
        e.preventDefault();
        //có nhiều cái span thì "this" để trỏ vào cái span đang đc click
        let id = $(this).data("todoid");
        //tìm vị trí xuất hiện đầu tiên của thằng có id mà muốn delete
        let index = todos.findIndex((val) => val.id === id);
        todos.splice(index, 1);

        //lưu vào localStorage
        //JSON.stringify chuyển object (arr cũng là object) thành string
        localStorage.setItem("todos", JSON.stringify(todos));

        renderTodos(todos);
    });

    $(".todo-list").on("click", ".btn-update", function (e) {
        e.preventDefault();
        //có nhiều cái span thì "this" để trỏ vào cái span đang đc click
        let id = $(this).data("todoid");
        // console.log(id);
        // console.log(todos);
        // console.log(todos.find((val) => val.id == id));
        selectedTodo = todos.find((val) => val.id == id); //ko để "===" đc, vì id đc tạo ra nó là string, còn id lấy từ cái class là int (ví dụ: "0.33" === 0.33 là sai, "0.33" == 0.33 là đúng)
        $("input.todo").val(selectedTodo.content);
    });

    $(".todo-list").on("change", "input.checkbox", function (e) {
        e.preventDefault();
        //có nhiều cái span thì "this" để trỏ vào cái span đang đc click
        let id = $(this).data("todoid");
        
        selectedTodo = todos.find((val) => val.id == id);
        if ($(this).prop("checked")) {
            //muốn dùng cách .class${id} thì id phải là số nguyên, số thực thì nó có dấu chấm thì trong html nó lại hiểu là class
            $(`.content${id}`).css("text-decoration", "line-through");
            selectedTodo.isDone = true;
        } else {
            $(`.content${id}`).css("text-decoration", "none");
            selectedTodo.isDone = false;
        }
        selectedTodo = null;

        //lưu vào localStorage
        //JSON.stringify chuyển object (arr cũng là object) thành string
        localStorage.setItem("todos", JSON.stringify(todos));
    });

});

//console.log(a);
// style="text-decoration: line-through;"
function renderTodos(todos) {
    //clear tất cả element con
    $(".todo-list ul").empty();

    //load data todos ra giao diện
    todos.map((val) => {

        //jqAppendTo : load content vào bên trong selector
        $(
            `
        <li>
            <input data-todoid = "${val.id}" class = "checkbox" type="checkbox" />
            <p class = "content${val.id}">
                ${val.id}. ${val.content}
            </p>
            <span data-todoid = "${val.id}" class= "btn-delete">Delete</span>
            <span data-todoid = "${val.id}" class= "btn-update">Update</span>
        </li>
        `
        ).appendTo(".todo-list ul");
        if (val.isDone) {
            $(`.content${val.id}`).css("text-decoration", "line-through");
            // $("input.checkbox")
        }
    });
    $("input.todo").val("");
}

//phant biệt span và div
//position có nhiều thuộc tính (4)

//phân biệt findIndex, indexOf, find,....