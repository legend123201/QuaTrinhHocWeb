const SwapArrayElement = require('../common/swapArrayElement');
const TestSortAlgorithm = require('../common/testSortAlgorithm');

// "Bubble" means bubble the min element one by one to the start index
/*
- Bên dưới là cách i chạy từ đầu tới cuối, j chạy ngược lại.
=> Cách 2 là i chạy từ cuối tới đầu, j tất nhiên là chạy ngược lại.
*/
function BubbleSort(a) {
	for (let i = 0; i < a.length - 1; i++) {
		// j start with the last index which is "a.length - 1", and end with i + 1, it means the worse case is j equal to 1 and i equal to 0 in the first loop, so that j - 1 will be 0, perfect 
		for (let j = a.length - 1; j > i; j--) {
			if (a[j] < a[j - 1]) {
				SwapArrayElement(a, j, j - 1);
			}
		}
	}
}

TestSortAlgorithm(BubbleSort);
