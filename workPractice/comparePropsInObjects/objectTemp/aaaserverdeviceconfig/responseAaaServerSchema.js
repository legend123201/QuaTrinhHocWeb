module.exports = {
	aaaServerName: {
		type: "string",
		required: true,
		description: "The name of the AAA Server."
	},
	accountingPort: {
		type: "integer",
		required: true,
		description: "The Accounting Port of the AAA Server."
	},
	authenticationMethod: {
		type: "string",
		description: "The authentication method of the AAA Server"
	},
	authenticationPort: {
		type: "integer",
		required: true,
		description: "The Authentication Port of the AAA Server."
	},
	dnName: {
		type: "string",
		description:
			"The name of the computer where the server is located OR the IP address of the computer where the server is located."
	},
	hostName: {
		type: "string",
		required: true,
		description: "The host name of the AAA Server."
	},
	hostName2: {
		type: "string",
		description: "The backup host name of the AAA Server."
	},
	isPasswordChanged: {
		type: "boolean",
		description: "Indicates whether or not the AAA server password has been changed (True/False)."
	},
	isSecretChanged: {
		type: "boolean",
		description: "Indicates whether or not the AAA server secret has been changed (True/False)."
	},
	id: {
		type: "integer",
		description: "The id of the AAA Server."
	},
	ipAddress: {
		type: "string",
		description:
			"The name of the computer where the server is located OR the IP address of the computer where the server is located."
	},
	ipAddress2: {
		type: "string",
		description:
			"The name of the computer where the server is located OR the IP address of the computer where the server is located."
	},
	onPremiseServer: {
		type: "boolean",
		description: "Enables/Disables premise server in AAA server."
	},
	onRadiusServer: {
		type: "boolean",
		description: "Enables/Disables radius server in AAA Server."
	},
	origin: {
		type: "string",
		description: "The origin of AAA Server."
	},
	password: {
		type: "string",
		required: true,
		description: "The Password of the AAA Server."
	},
	port: {
		type: "integer",
		required: true,
		description: "The Port of the AAA Server."
	},
	retries: {
		type: "integer",
		required: true,
		description: "The Retries of the AAA Server."
	},
	searchBase: {
		type: "string",
		description:
			"The search base in the LDAP Server where authentication information can be found (e.g., o=alcatel.com)."
	},
	secret: {
		type: "string",
		required: true,
		description: "The Secret of the AAA Server."
	},
	ssl: {
		type: "string",
		description:
			"Set this field to True or False to inform the switch whether SSL (Secure Socket Layer) is enabled or disabled on the LDAP authentication server.",
		enum: ["NS", "TRUE", "FALSE"]
	},
	timeout: {
		type: "integer",
		required: true,
		description: "The Timeout of the AAA Server."
	},
	type: {
		type: "string",
		required: true,
		description: "The Type of the AAA Server."
	},
	vrfName: {
		type: "string",
		description: "The VRF Instance associated with the LDAP Server if applicable."
	},
	preemption: {
		type: "boolean",
		description:
			"Whenever Primary and Secondary servers are configured in OVNG LDAP Server, we should allow configuration there for Pre-emption. Defaults are Pre-emption=Enabled."
	},
	countDownTimer: {
		type: "integer",
		description:
			"Whenever Primary and Secondary servers are configured in OVNG LDAP Server, we should allow configuration there for Pre-emption. Defaults are Count-down timer=600 seconds. The range for the Count-down timer should be = 600 seconds (10 minutes) to 3600 seconds (1 hour)."
	},
	upamRadiusType: {
		type: "string",
		description: "Distinguish between Radius UPAM and Radius Server."
	},
	tls: {
		type: "boolean",
		description: "Enable/Disable the TLS option."
	},
	authenticationMethod: {
		type: "string",
		description: "XXX"
	}
};
