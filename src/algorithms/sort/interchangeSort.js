const SwapArrayElement = require('../common/swapArrayElement');
const TestSortAlgorithm = require('../common/testSortAlgorithm');

function InterchangeSort(a) {
	// "i" not need to go to the end index, because the var "j" will
	for (let i = 0; i < a.length - 1; i++) {
		for (let j = i + 1; j < a.length; j++) {
			if (a[i] > a[j]) {
				SwapArrayElement(a, i, j);
			}
		}
	}
}

TestSortAlgorithm(InterchangeSort);
