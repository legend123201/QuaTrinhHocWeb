/*
const deleteChar = (originString, deleteChar) => {
	let result = "";
	// for (let i = 0; i < originString.length; i++) {
	// 	if (originString[i] !== deleteChar) {
	// 		result += originString[i];
	// 	}
	// }

	let a = new RegExp(deleteChar, "ig");
	result = originString.replace(a, "");
	console.log(result);
};

deleteChar("nsadgA", "a");

const showFibbonacy = (n) => {
	// let e1 = 1;
	// let e2 = 1;
	// console.log(e1);
	// console.log(e2);
	// for (let i = 2; i < n; i++) {
	// 	let t = e2;
	// 	e2 = e1 + e2;
	// 	e1 = t;
	// 	console.log(e2);
	// }

    if (n === 0) return 1;
    if (n === 1) return 1; 
    let result = showFibbonacy(n - 1) + showFibbonacy(n - 2);
    console.log(result);
    return result;
};
showFibbonacy(4)


function mostFrequent(arr) {
	if (arr.length === 0) return "Array is empty!";

	// Your code here
	let mostElement = arr[0];
	let max = 1;
	const object = {};

	arr.forEach((e) => {
		if (object[e]) {
			object[e]++;
		} else {
			object[e] = 1;
		}

		if (object[e] > max) {
			max = object[e];
			mostElement = e;
		}
	});

	return mostElement;
}
console.log(mostFrequent([1, 2, 2, 3, 3, 3, 4]));


function removeDuplicates(arr) {
	const seen = {};
	const result = [];

	for (const e of arr) {
		if (!seen[e]) {
			seen[e] = true;
			result.push(e);
		}
	}
	return result;
}



function countVowels(str) {
	const vowels = new Set(["a", "e", "i", "o", "u"]);
	let count = 0;

	for (const char of str.toLowerCase()) {
		if (vowels.has(char)) {
			count++;
		}
	}
	return count;
}
*/

function isPrime(n) {
	if (n <= 1) return false; // 0 and 1 are NOT prime

	for (let i = 2; i <= Math.sqrt(n); i++) {
		if (n % i === 0) {
			return false;
		}
	}
	return true;
}

console.log(isPrime(7));  // true
console.log(isPrime(10)); // false
