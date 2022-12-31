const getAPI = require('./getApi');

const myPromise1 = getAPI('https://fakestoreapi.com/products/1');

// one of the promise in the promises chain have error and you want to stop immediately 
// if one of the promise in the promises chain have error and you still want to run the rest, just simply put catch after every single then(). 
myPromise1.then(
    function (value) {
        console.log("flag 1");
        console.log(value);

        const myPromise2 = getAPI('https://fakestoreapi.com/products/22');
        return myPromise2;
    }
).then(
    function (value) {
        console.log("flag 2");
        console.log(value);

        const myPromise3 = getAPI('https://fakestoreapi.com/products/3');
        return myPromise3;
    }
).then(
    function (value) {
        console.log("flag 3");
        console.log(value);
    }
).catch((error) => {
    console.log("error", error);
});
