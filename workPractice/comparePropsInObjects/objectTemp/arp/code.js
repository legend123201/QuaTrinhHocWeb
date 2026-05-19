const _ = require("lodash");

module.exports = {
	status: {
		type: "integer",
		description: "HTTP Status Code associated to the response.",
	},
	message: {
		type: "string",
		description: "Status message associated to the response.",
	},
	macsecAdminStatus: {
		type: "boolean",
		description:
			"Indicates whether the MACsec option is enabled. This field is only supported on the Switch port.",
	},
	macsecMode: {
		type: "string",
		description:
			"The MACsec mode of the port. This field is only supported on the Switch port.",
		enum: ["static", "dynamicRadius"],
	},
	ifIndex: {
		type: "number",
		description: "The index of the port.",
	},
	portNumber: {
		type: "string",
		description: "The port number on the device.",
	},
	serialNumber: {
		type: "string",
		description: "The serial number of the device on which the port resides.",
	},
};
