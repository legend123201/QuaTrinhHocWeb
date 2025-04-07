const consoleLogForms = require("./consoleLogForms");
const functions = require("./functions");
const _ = require("lodash");
const postman = require("./objectTemp/arp/postman");
const code = require("./objectTemp/arp/code");
const { ObjectId, NumberLong, ISODate, NumberInt } = functions.fakeFunctionForFormat;

const logItems = [0];
let objectPairsArray = [
	{
		object1Name: "postman",
		object2Name: "code",
		object1: postman,
		object2: code
	}
];

consoleLogForms.compareObjectPairs_Diff(objectPairsArray, logItems);

/*
================================================================================
************TITLE: COMPARE "postman" VS "code"************
- Number of props in postman:  12
- Number of props in code:  12

- Props in postman but not in code:
 [ 'id', 'preemption', 'preemptionCountDownTimer' ] ( 3 fields )
- Props in code but not in postman:
 [ 'mtu', 'port', 'vpnProfileID' ] ( 3 fields )
================================================================================
*/
