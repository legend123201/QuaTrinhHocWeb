const fetch = require('node-fetch');

module.exports = (url, myCallback) => {
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((data) => {
            // console.log('Success:', data);
            myCallback(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}