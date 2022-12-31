const getAPI = require('./getApi');

const executeAfterGetAPI = (data) => {
    console.log(data);
}

getAPI('https://fakestoreapi.com/products/1', executeAfterGetAPI);