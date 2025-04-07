// Assign value of the key in ObjectSrc to the key have the same key name in objectDes
module.exports = (objectDes, ObjectSrc) => {
    for (key in objectDes) {
        if (ObjectSrc.hasOwnProperty(key)) {
            objectDes[key] = ObjectSrc[key];
        }
        else {
            objectDes[key] = "404 NOT FOUND!"
        }
    }
}