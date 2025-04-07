const TestSortAlgorithm = require('../common/testSortAlgorithm');

// Merge and sort two parts together 
function Merge(a, l, middleIndex, r) {
	let b = [...a];

	// Ex vars positions in the first WHILE's loop: a[6-leftWall, 1, 2, 5, 9, 3, 4, 7, 10, 8], b[6-l-i, 1, 2, 5, 9-middleIndex, 3-j, 4, 7, 10, 8-r]
	let leftWall = l;
	let i = l;
	let j = middleIndex + 1;

	while (i <= middleIndex && j <= r) {
		if (b[i] < b[j]) {
			a[leftWall] = b[i];
			leftWall++;
			i++;
		} else if (b[i] > b[j]) {
			a[leftWall] = b[j];
			leftWall++;
			j++;
		} else {
			a[leftWall] = a[leftWall + 1] = b[i];
			leftWall += 2;
			i++;
			j++;
		}
	}

	// Add remaining elements in the first part to the array (if any)
	while (i <= middleIndex) {
		a[leftWall] = b[i];
		leftWall++;
		i++;
	}

	// Add remaining elements in the second part to the array (if any)
	while (j <= r) {
		a[leftWall] = b[j];
		leftWall++;
		j++;
	}
}

function MergeSort(a, l, r) {
	// if l === r means the sub array have 1 element
	if (l >= r) return;

	const middleIndex = l + Math.floor((r - l) / 2);
	// The worse case is that the array length is 2, middleIndex will be 0, EX: a = [3, 1] => we have MergeSort(a, 0, 0) and MergeSort(a, 1, 1) => Two parts, each part have 1 element
	MergeSort(a, l, middleIndex); // Sort the first haft element(s)
	MergeSort(a, middleIndex + 1, r); // Sort the second haft element(s)

	Merge(a, l, middleIndex, r); // Merge and sort two parts together 
}

TestSortAlgorithm(MergeSort);
