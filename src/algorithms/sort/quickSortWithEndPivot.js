const SwapArrayElement = require('../common/swapArrayElement');
const testSortAlgorithm = require('../common/testSortAlgorithm');

// a: array, l: left, r: right, p: pivot
// Partition the array, after partition, it have 2 parts, first part is smaller than the pivot, second part is equal or higher than the pivot
// Return the leftWall (partitionPoint), this is the index that separate the 2 parts
function Partition(a, l, r) {
	const p = a[r];
	let leftWall = l;

	// vòng lặp kiếm những thằng nào nhỏ hơn pivot và ném qua leftWall
	for (let i = l; i < r; i++) {
		if (a[i] < p) {
			SwapArrayElement(a, leftWall, i);
			leftWall++;
		}
	}

	SwapArrayElement(a, leftWall, r);

	return leftWall;
}

// a: array, l: left, r: right
// Condition: none
function QuickSort1(a, l, r) {
	if (l < r) {
		const partitionPoint = Partition(a, l, r);
		QuickSort1(a, l, partitionPoint - 1); // the partitionPoint element is in the right place, so we minus 1
		QuickSort1(a, partitionPoint + 1, r); // the partitionPoint element is in the right place, so we plus 1
	}
}

// Condition: the array has at least 2 elements
function QuickSort2(a, l, r) {
	const partitionPoint = Partition(a, l, r);
	if (l < partitionPoint - 1) QuickSort2(a, l, partitionPoint - 1);
	if (partitionPoint + 1 < r) QuickSort2(a, partitionPoint + 1, r);
}

// main
testSortAlgorithm(QuickSort1);
