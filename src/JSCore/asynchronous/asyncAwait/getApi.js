const fetch = require('node-fetch');

module.exports = (url) => {
    return new Promise((res, rej) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log('Success:', data);
                res(data);
            })
            .catch((error) => {
                // console.error('Error:', error);
                rej(error);
            });
    });

}