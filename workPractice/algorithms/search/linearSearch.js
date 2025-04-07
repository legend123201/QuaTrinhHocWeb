const array = [8, 2, 6, 3, 5, 9, 1, 4];

// Search and return the index of the findingValue, return -1 if not found
const LinearSearch = (a, findingValue) => {
	for (let i = 0; i < a.length; i++) {
		if (a[i] === findingValue) {
			return i;
		}
	}

	return -1;
};

console.log(LinearSearch(array, 6)); // => 2
console.log(LinearSearch(array, 10)); // => -1
