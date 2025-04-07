const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');

if (isMainThread) {
	module.exports = function parseJSAsync(script) {
		return new Promise((resolve, reject) => {
			const worker = new Worker(__filename, {
				workerData: script,
			});
			worker.on('message', resolve);
			worker.on('error', reject);
			worker.on('exit', (code) => {
				if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
			});
		});
	};
} else {
	const { parse } = require('some-js-parsing-library');
	const script = workerData;
	parentPort.postMessage(parse(script));
}

// đang đọc cái này: https://2coffee.dev/bai-viet/worker-threads-la-gi-ban-da-biet-khi-nao-thi-su-dung-worker-threads-trong-nodejs-chua/
