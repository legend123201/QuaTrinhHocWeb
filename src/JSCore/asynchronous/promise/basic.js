const getAPI = require('./getApi');

const myPromise = getAPI('https://fakestoreapi.com/products/10');

myPromise.then(
    function (value) {
        console.log(value);
    },

    function (error) {
        console.log("error", error);
    }
);