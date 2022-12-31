module.exports = function fakeRequest(time) {
    return new Promise((res) => setTimeout(res, time));
}

