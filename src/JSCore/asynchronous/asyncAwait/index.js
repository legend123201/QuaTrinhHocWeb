const getAPI = require('./getApi');

async function asyncFunction() {
    try {
        const result1 = await getAPI('https://fakestoreapi.com/products/1');
        console.log(result1);

        const result2 = await getAPI('https://fakestoreapi.com/products/2');
        console.log(result2);

        const result3 = await getAPI('https://fakestoreapi.com/products/3');
        console.log(result3);
    } catch (error) {
        console.log("error", error);
    }

    console.log("moving on");
}

// asyncFunction();

const a = async () => {
    await asyncFunction();
    console.log("Above funstion have done!");
}

a();




