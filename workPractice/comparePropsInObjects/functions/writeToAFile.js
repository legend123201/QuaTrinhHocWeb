const fs = require('fs');

// String not have a method that delete a char at a specified index, so we need create our own
String.prototype.removeAt = function (index, distance) {
    return this.slice(0, index) + this.slice(index + distance, this.length);
};

module.exports = (data, isDeleteQuotesInObject = false) => {
    // data usually is a array, or a object

    const filePath = './temp.txt'; // file extension có thể là .json

    fs.writeFile(filePath, JSON.stringify(data, null, "\t"), function (err) {
        if (err) throw err;

        const buffer = fs.readFileSync(filePath);
        let fileData = buffer.toString();

        if (isDeleteQuotesInObject) {
            // delete quotes at field names of the object, ex: "hello": 0 -> hello: 0
            for (let i = 0; i < fileData.length; i++) {
                if (fileData.charAt(i) === ':') {
                    let deletedQuotes = 0;
                    let j = i;
                    while (deletedQuotes !== 2) {
                        j--;
                        if (fileData.charAt(j) === '"') {
                            fileData = fileData.removeAt(j, 1);
                            deletedQuotes++;
                        }
                    }
                }
            }
        }

        // save back to the file
        fs.writeFile(filePath, fileData, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    });
}