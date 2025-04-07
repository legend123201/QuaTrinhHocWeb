// import { AsyncLocalStorage } from 'node:async_hooks';
const { AsyncLocalStorage } = require('node:async_hooks');
const storage = new AsyncLocalStorage();
let id = 0;

function one() {
	id++;
	// Create an async context store
	storage.enterWith({
		name: 'Wes context Bos',
		id,
	});
	two();
}

function two() {
	// Access the store set in one()
	const store = storage.getStore();
	const delayTime = Math.floor(Math.random() * 5) * 1000;
	console.log(`Delay time of the ID ${store.id} is: ${delayTime}`);

	// After a random amount of time, call three
	setTimeout(three, delayTime);
}

function three() {
	// Access the store set in one()
	const store = storage.getStore();
	// They are called out of order, but the ID is correct
	console.log(`${store.name}, with id: ${store.id}`);
}

for (let i = 0; i < 6; i++) {
	one();
}
