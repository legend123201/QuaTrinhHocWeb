const fakeRequest = require("../asyncAwait/waitForATime");

// Promise.allSettled() giống Promise.all nhưng nó sẽ ko dừng khi 1 trong các promise bị lỗi

const test = async () => {
    console.time("Estimate time");

    let promises = [];
    const userList = [{ name: "Luu", age: 17 }, { name: "Louis", age: 18 }, { name: "lala", age: 19 }];

    promises.push(...(userList.map(async (user) => {
        await fakeRequest(2000);
        user.age = 20;
        return 1;
    })));

    promises.push(...(userList.map(async (user) => {
        await fakeRequest(2000);
        user.class = "9A1";
        const a = 1 / 0;
        console.log(a);
        window.printme();
        return 2;
    })));

    console.log(promises);
    // => [
    //     Promise { <pending> },
    //     Promise { <pending> },
    //     Promise { <pending> },
    //     Promise { <pending> },
    //     Promise { <pending> },
    //     Promise { <pending> }
    // ]

    const promiseAllSettledReturn = await Promise.allSettled(promises);

    console.log(promiseAllSettledReturn);
    // => [
    //     { status: 'fulfilled', value: 1 },
    //     { status: 'fulfilled', value: 1 },
    //     { status: 'fulfilled', value: 1 },
    //     {
    //       status: 'rejected',
    //       reason: ReferenceError: window is not defined
    //           at C:\Users\tvluu\Desktop\JScore\src\asynchronous\promiseObject\promiseAllSettled.js:25:9
    //           at runNextTicks (node:internal/process/task_queues:61:5)
    //           at listOnTimeout (node:internal/timers:528:9)
    //           at processTimers (node:internal/timers:502:7)
    //     },
    //     {
    //       status: 'rejected',
    //       reason: ReferenceError: window is not defined
    //           at C:\Users\tvluu\Desktop\JScore\src\asynchronous\promiseObject\promiseAllSettled.js:25:9
    //           at runNextTicks (node:internal/process/task_queues:61:5)
    //           at listOnTimeout (node:internal/timers:528:9)
    //           at processTimers (node:internal/timers:502:7)
    //     },
    //     {
    //       status: 'rejected',
    //       reason: ReferenceError: window is not defined
    //           at C:\Users\tvluu\Desktop\JScore\src\asynchronous\promiseObject\promiseAllSettled.js:25:9
    //     }
    //   ]
    //   [
    //     { name: 'Luu', age: 20, class: '9A1' },
    //     { name: 'Louis', age: 20, class: '9A1' },
    //     { name: 'lala', age: 20, class: '9A1' }
    //   ]

    console.log(userList);

    console.timeEnd("Estimate time");
}

test();
