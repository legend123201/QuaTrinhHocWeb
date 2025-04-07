const SwapArrayElement = require('../common/swapArrayElement');
const testSortAlgorithm = require('../common/testSortAlgorithm');

// a: array, l: left, r: right, p: pivot
// Ex vars positions in the first call: a[6-i-l, 1, 2, 5, 9-p, 3, 4, 7, 10, 8-j-r]
// Condition: the array has at least 2 elements
function QuickSort(a, l, r) {
	let i = l;
	let j = r;
	const p = a[Math.floor((l + r) / 2)];

	// Thực chất cách này thì chọn pivot ở đâu cũng được, tại nó đi từ 2 hướng left và right và va vào nhau, nên khả năng rất cao cũng loop qua thằng pivot
	// Còn cách quickSortWithEndPivot thì ko loop qua thằng pivot đc vì mình chạy biến đếm từ left cho tới vị trí nhỏ hơn thằng right 1 đơn vị
	do {
		while (a[i] < p) i++;
		while (a[j] > p) j--;

		if (i <= j) {
			SwapArrayElement(a, i, j);
			i++;
			j--;
		}
	} while (i <= j);

	if (l < j) QuickSort(a, l, j); // Still have 2 or more elements
	if (i < r) QuickSort(a, i, r); // Still have 2 or more elements
}

// main
testSortAlgorithm(QuickSort);
