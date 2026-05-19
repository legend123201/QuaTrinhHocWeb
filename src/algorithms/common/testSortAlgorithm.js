const isArraySorted = require('./isArraySorted');

module.exports = function TestSortAlgorithm(sortFunction) {
	let isFailed = false;
	const testArrays = [
		// [1, 3], // 1
		// [3, 1], // 2
		[6, 1, 2, 5, 9, 3, 4, 7, 10, 8], // 3
		[1, 2, 3, 4, 5], // 4
		[5, 4, 3, 2, 1], // 5
		[5, 5, 5], // 6
		[1, 2, 10, 7, 7, 9, 5, 4], // 7
	];

	for (let i = 0; i < testArrays.length; i++) {
		const temp = testArrays[i];
		sortFunction(temp, 0, temp.length - 1);

		if (!isArraySorted(temp)) {
			isFailed = true;
			console.log(`Testcase #${i + 1} is failed!!! Array after sorted:`);
			console.log(temp);
		}
		console.log(temp);
	}

	if (!isFailed) {
		console.log(`All testcases passed!`);
	}
};
