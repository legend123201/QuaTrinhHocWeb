// This function is work, they do it the same on the internet
module.exports = function SwapArrayElement(a, i, j) {
	const t = a[i];
	a[i] = a[j];
	a[j] = t;
}