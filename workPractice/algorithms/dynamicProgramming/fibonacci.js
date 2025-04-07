// Tính được giá trị nào là mình Lưu vào array luôn

const fib = (n) => {
	const value = [];
	// Khởi tạo 2 phần tử đầu tiên
	value[0] = 0;
	value[1] = 1;

	for (let i = 2; i <= n; i++) {
		value[i] = value[i - 1] + value[i - 2];
	}

	// Trả về giá trị cần tìm ở vị trí thứ n
	return value[n];
};

// fibonacci: 0 1 1 2 3 5 8 13 21
console.log(fib(6)); // => 8
