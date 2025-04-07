module.exports = (object1, object2) => {
    const object1AKeys = Object.keys(object1);

    return object1AKeys.filter((key) => {
        return !object2.hasOwnProperty(key);
    });
}