const SwapArrayElement = require('../common/swapArrayElement');
const TestSortAlgorithm = require('../common/testSortAlgorithm');

// "Insertion" means Insert the current element to the sorted array
function InsertionSort(a) {
	for (let i = 0; i < a.length - 1; i++) {
        // Từ i trở về 0 (i = 0 trong loop đầu tiên) thì đã sort, mình sẽ bắt đầu với số tiếp theo của i
		let j = i + 1;

        // j > 0 because we have compare the j with j - 1, it mean the worse case is j will be 1 and j - 1 will be 0
		while (j > 0 && a[j] < a[j - 1]) {
			SwapArrayElement(a, j, j - 1);
			j--;
		}
	}
}

TestSortAlgorithm(InsertionSort);
