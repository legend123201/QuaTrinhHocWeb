const _ = require("lodash");
const responseAaaProfileSchema = require("./responseAaaProfileSchema");

module.exports = {
	..._.omit(responseAaaProfileSchema, ["aaaProfileName", "childStatus"]),

	name: {
		type: "string",
		description: "The name of the AAA Profile."
	},
	status: {
		type: "string",
		description: "The configuration status of the AAA Profile.",
		enum: ["SUCCESS", "FAIL", "PENDING"]
	}
};
