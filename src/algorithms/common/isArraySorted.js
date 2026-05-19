module.exports = function isArraySorted(array) {
	if (array.length === 0 || array.length === 1) {
		return true;
	}

	for (let i = 0; i < array.length - 1; i++) {
		if (array[i] > array[i + 1]) {
			return false;
		}
	}

	return true;
};
