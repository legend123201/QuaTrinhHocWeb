const getAPI = require('./getApi');

// 'https://fakestoreapi.com/products'

getAPI('https://fakestoreapi.com/products/1', (data) => {
    console.log(data);
    getAPI('https://fakestoreapi.com/products/2', (data) => {
        console.log(data);
        getAPI('https://fakestoreapi.com/products/3', (data) => {
            console.log(data);
        });
    });
});
