/*
### NOTE cách tìm kiếm  theo Regular Expressions trong Visual Code:
- Bước 1: Bấm vào biểu tượng Regular Expressions để bật mode kiếm theo Regular Expressions
- Bước 2: Nhập 1 regex hợp lệ (mình nhập "(" mà ko có ")" nó sẽ lỗi, chắc là nó là kí tự đặc biệt, nên né nó):
+ VD1: sails.log.info.*,
=> Nghĩa là: tìm text có prefix là "sails.log.info", theo sau là 0 hoặc nhiều kí tự bất kì (".*"), và cuối cùng là có dấu phẩy ","
*/

// .test() return true if the string match
/*
const regex = /your-pattern/;
const str = "your test string";

if (regex.test(str)) {
  console.log("✅ Match!");
} else {
  console.log("❌ No match.");
}
*/

// .match() return groups of the string follow by the regex rules
const regex = /^(?![-.])[A-Za-z0-9_.-]{0,50}(?<!\.)$/;
const strings = [
	"abc123",
	"a.b-c_123",
	"abc.def.ghi",
	"a-b_c.d",
	"a".repeat(50),
	"",
	".abc",
	"-hello",
	"abc.",
	"abc@123",
	"a".repeat(51)
];

for (let i = 0; i < strings.length; i++) {
	const match = strings[i].match(regex);
	if (match) {
		console.log("Matched:", JSON.stringify(match));
	} else {
		console.log("No match:", strings[i]);
	}
}
