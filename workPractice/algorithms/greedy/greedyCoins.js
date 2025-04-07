/*
Cho nhiều đồng xu trên bàn, có 3 loại mệnh giá là: 4đ, 3đ, 1đ
Số tiền cần thối cho khách là 6đ, cần số tiền xu đưa cho khách là ít nhất
=> Greedy logic: chọn những đồng xu có giá trị lớn nhất trước để nhanh nhanh đạt được số tiền yêu cầu. Nên nó sẽ là: 1 đồng xu 4đ và 2 đồng xu 1đ
=> Thực tế: 2 đồng xu 3đ sẽ là ít số đồng xu nhất.
*/

const denominations = [4, 3, 1]; // điều kiện là array phải sort giảm dần sẵn
const targetAmount = 6;
let refundCoins = [];
let total = 0;

while (total !== targetAmount) {
	for (let i = 0; i < denominations.length; i++) {
		if (total + denominations[i] <= targetAmount) {
			total += denominations[i];
			refundCoins.push(denominations[i]);
			break;
		}
	}
}

console.log("numberOfCoins", refundCoins.length); // => 3
console.log("refundCoins", refundCoins); // => [ 4, 1, 1 ]
