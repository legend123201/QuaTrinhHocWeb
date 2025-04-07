const functions = require("../functions");

module.exports = (object1, object2) => {
    let result = functions.commonPropsIn2Objects(object1, object2);

    console.log("====================TITLE: Props in both objects");

    console.log(`props in both objects\n`, result.sort(), `( ${result.length} fields )`);

    console.log("\n****************************************");
    console.log("=================================================");
    console.log("****************************************\n");
}