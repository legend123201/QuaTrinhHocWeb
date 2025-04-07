/*
### NOTE cách tìm kiếm  theo Regular Expressions trong Visual Code:
- Bước 1: Bấm vào biểu tượng Regular Expressions để bật mode kiếm theo Regular Expressions
- Bước 2: Nhập 1 regex hợp lệ (mình nhập "(" mà ko có ")" nó sẽ lỗi, chắc là nó là kí tự đặc biệt, nên né nó):
+ VD1: sails.log.info.*,
=> Nghĩa là: tìm text có prefix là "sails.log.info", theo sau là 0 hoặc nhiều kí tự bất kì (".*"), và cuối cùng là có dấu phẩy ","
*/

function isURL(str) {
    var urlRegex = /^(http(s)?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ;,./?%&=]*)?$/; // define a regex here
    var url = new RegExp(urlRegex, 'i');
    return str.length < 2083 && url.test(str);
}
var check = [
    'http://www.foufos.gr',
    'https://www.foufos.gr',
    'http://foufos.gr',
    'http://www.foufos.gr/kino',
    'http://werer.gr',
    'www.foufos.gr',
    'www.mp3.com',
    'www.t.co',
    'http://t.co',
    'http://www.t.co',
    'https://www.t.co',
    'www.aa.com',
    'http://aa.com',
    'http://aaa.com',
    'http://www.aa.com',
    'https://www.aa.com',
    'www.foufos',
    'www.foufos-.gr',
    'www.-foufos.gr',
    'foufos.gr',
    'http://www.foufos',
    'http://foufos',
    'www.mp3#.com',
    'www.mp3/#/dsd.com',
    "https://tmadevdebug.dev.activation.ovng.myovcloud.com",
    "https://debug.dev.myovcloud.com/#/pyfvr2elx1y0zb/"
];

for (let index = 0; index < check.length; index++) {
    var url = check[index]
    if (isURL(check[index]))
        console.log(`${url}         ✔`);
    else {
        console.log(`${url}          ❌`);
    }

}