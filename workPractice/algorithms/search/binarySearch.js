const array = [1, 4, 5, 8, 11, 22, 25, 33, 37, 58, 60, 65, 72, 78, 81, 84, 89, 95, 97, 100];

// Ở dưới mình xài while loop nhưng có thể dùng đệ quy để làm thuật toán này
// Search and return the index of the findingValue, return -1 if not found
const BinarySearch = (a, findingValue) => {
	let left = 0;
	let right = a.length - 1;
	let mid;

	// The array or the subarray could have only 1 element, so we must use "<=" in the while's condition
	while (left <= right) {
		mid = Math.floor((right - left) / 2) + left;

		if (a[mid] === findingValue) {
			return mid;
		} else if (findingValue > a[mid]) {
			left = mid + 1; // get the subarray behind the mid position
		} else {
			// findingValue < a[mid]
			right = mid - 1; // get the subarray in front of the mid position
		}
	}

	return -1;
};

console.log(BinarySearch(array, 78)); // => 13
console.log(BinarySearch(array, 10)); // => -1
