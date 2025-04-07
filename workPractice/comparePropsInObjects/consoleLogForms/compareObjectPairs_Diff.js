const functions = require("../functions");

module.exports = (objectPairsArray, logItems) => {
    for (let i = 0; i < objectPairsArray.length; i++) {
        if (!logItems.includes(i)) {
            continue;
        }

        let propsInObject1ButNotInObject2 = functions.propsInObject1ButNotInObject2(objectPairsArray[i].object1, objectPairsArray[i].object2);
        let propsInObject2ButNotInObject1 = functions.propsInObject1ButNotInObject2(objectPairsArray[i].object2, objectPairsArray[i].object1);

        console.log("================================================================================");
        console.log(`************TITLE: COMPARE "${objectPairsArray[i].object1Name}" VS "${objectPairsArray[i].object2Name}"************`);

        console.log(`- Number of props in ${objectPairsArray[i].object1Name}: `, functions.numberOfPropsInObject(objectPairsArray[i].object1));
        console.log(`- Number of props in ${objectPairsArray[i].object2Name}: `, functions.numberOfPropsInObject(objectPairsArray[i].object2));

        console.log(`\n- Props in ${objectPairsArray[i].object1Name} but not in ${objectPairsArray[i].object2Name}:\n`, propsInObject1ButNotInObject2.sort(), `( ${propsInObject1ButNotInObject2.length} fields )`);
        console.log(`- Props in ${objectPairsArray[i].object2Name} but not in ${objectPairsArray[i].object1Name}:\n`, propsInObject2ButNotInObject1.sort(), `( ${propsInObject2ButNotInObject1.length} fields )`);

        console.log("================================================================================\n");
    }
}