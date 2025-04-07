const _ = require("lodash");
const responseAaaServerSchema = require("./responseAaaServerSchema");
module.exports = {
	..._.omit(responseAaaServerSchema, ["aaaServerName", "onRadiusServer", "origin"]),

	name: {
		type: "string",
		description: "The name of the AAA Server."
	},
	status: {
		type: "string",
		description: "The configuration status of the AAA Server.",
		enum: ["SUCCESS", "FAIL", "PENDING", "PRECONFIG_PENDING", "APPLIED"]
	}
};
