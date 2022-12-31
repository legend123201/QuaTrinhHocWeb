const fakeRequest = require("../asyncAwait/waitForATime");

// Promise.all() nhận array chứa các promise làm argument
// nên mới dùng .map() để trả về array bao gồm các hàm async await (chính là các promise)
// tất cả các promise trong array sẽ chạy cùng song song với nhau
// => đây là điểm mạnh khi dùng promise all

const test = async () => {
    try {
        console.time("Estimate time");

        let promises = [];
        const userList = [{ name: "Luu", age: 17 }, { name: "Louis", age: 18 }, { name: "lala", age: 19 }];

        promises.push(...(userList.map(async (user) => {
            await fakeRequest(2000);
            user.age = 20;
        })));

        promises.push(...(userList.map(async (user) => {
            await fakeRequest(2000);
            user.class = "9A1";
            window.printme(); // dòng này để test lỗi
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

        await Promise.all(promises);

        console.log(userList);

        console.timeEnd("Estimate time");
    } catch (error) {
        console.log("Error here: ", error);
    }
}

test();
