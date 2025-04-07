function fakeRequest(time) {
	return new Promise((res) => setTimeout(res, time));
}

const a = async () => {
	try {
		let m = n;
		await fakeRequest(100);

		return {
			status: 200,
			mess: 'success',
		};
	} catch (error) {
		return {
			status: 500,
			mess: 'failed',
		};
	}
};

const b = async () => {
	try {
		let m = 2;
		await fakeRequest(150);

		return {
			status: 200,
			mess: 'success',
		};
	} catch (error) {
		return {
			status: 500,
			mess: 'failed',
		};
	}
};

const c = async () => {
	const d = await Promise.all([a(), b()]);
	console.log("error" + d[0].toString());
};

c();
