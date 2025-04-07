const SwapArrayElement = require('../common/swapArrayElement');
const TestSortAlgorithm = require('../common/testSortAlgorithm');

// "Selection" means Select the minimum 
function SelectionSort(a) {
	let minElementIndex;

	for (let i = 0; i < a.length - 1; i++) {
		minElementIndex = i;

		for (let j = i + 1; j < a.length; j++) {
			if (a[j] < a[minElementIndex]) {
				minElementIndex = j;
			}
		}

		SwapArrayElement(a, i, minElementIndex);
	}
}

TestSortAlgorithm(SelectionSort);
