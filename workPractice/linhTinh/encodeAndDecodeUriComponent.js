/*
- URI (uniform resource identifier) identifies a resource (text document, image file, etc)
- URL (uniform resource locator) is a subset of the URIs that include a network location
- URN (uniform resource name) is a subset of URIs that include a name within a given space, but no location
=> tài liệu phân biệt 3 cái này trên mạng tràn lan nhưng ko giống nhau, nhưng cũng nói ra rằng URI bao gồm cả URL và URN, URL và URN bằng cấp nhau 

Tham khảo: https://stackoverflow.com/questions/4540753/should-i-use-encodeuri-or-encodeuricomponent-for-encoding-urls
- encodeURI() will not encode A-Z a-z 0-9 ; , / ? : @ & = + $ - _ . ! ~ * ' ( ) #
=> Use it when your input is a complete URL like 'https://searchexample.com/search?q=wiki'
- encodeURIComponent() will not encode A-Z a-z 0-9 - _ . ! ~ * ' ( )
=> Use it when your input is part of a complete URL such as a query string. e.g const queryStr = encodeURIComponent(someString)
==> encodeURIComponent does not encode -_.!~*'(). If you want to these characters are encoded, you have to replace them with a corresponding UTF-8 sequence of characters
===> Thậm chí còn ko encode 2 ký tự: [ ]

// code encodeURIComponent handle full chars, cướp đc từ UI code, ngon 
static encodeURIComponentAllChars(str) {
        return encodeURIComponent(str).replace(/[-_.!~*'()]/g, function (c) {
            return "%" + c.charCodeAt(0).toString(16).toUpperCase();
        });
    }

// code decodeURIComponent trong code BE, nhưng tại sao lại phải replace dấu '+' thành khoảng trắng trước khi decode nhỉ?
function decodeQueryParam(s) {
    return decodeURIComponent(s.replace(/\+/g, ' '));
}
*/


let s1 = "https://w3schools. com/my test.asp?name=ståle&car=saab";
let encodedS1 = encodeURIComponent(s1);
console.log(encodedS1); // => https%3A%2F%2Fw3schools.%20com%2Fmy%20test.asp%3Fname%3Dst%C3%A5le%26car%3Dsaab (có encode các kí tự đặc biệt)

let decodedS1 = decodeURIComponent(encodedS1);
console.log(decodedS1);

let s2 = "https://w3schools. com/my test.asp?name=ståle&car=saab";
let encodedS2 = encodeURI(s2);
console.log(encodedS2); // => https://w3schools.%20com/my%20test.asp?name=st%C3%A5le&car=saab (Không encode các kí tự đặc biệt)

let decodedS2 = decodeURI(encodedS2);
console.log(decodedS2);

function encodeURIComponentAllChars(str) {
    return encodeURIComponent(str).replace(/[-_.!~*'()]/g, function (c) {
        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
}

let c = encodeURIComponentAllChars("lala%@#$");
function decodeQueryParam(s) {
    return decodeURIComponent(s.replace(/\+/g, ' '));
}
let d = decodeQueryParam(c);
let e = decodeQueryParam(d);
console.log(c, d, e);