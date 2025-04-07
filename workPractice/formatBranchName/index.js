/*
- Nên tạo tên branch như sau: master_OVNG-14770_Epic (master là tên branch mình tạo branch từ đó và sẽ merge vào đó). Có thể ghi thêm 1 ít description lên tên branch, ngắn thôi.
- Commit message thì vẫn nên có cả description cho rõ ràng.
*/

const s = 'DOOPL-795 Update the Pushy payload data';

const result = s
	.replaceAll(' - ', '-')
	.replaceAll(' ', '_')
	.replaceAll('[', '_')
	.replaceAll(']', '_')
	.replaceAll('&', 'and')
	.replaceAll('"', '-')
	.replaceAll('/', '_');

console.log(result);
