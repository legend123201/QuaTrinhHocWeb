module.exports = {
	id: "",
	aaaServerName: "",
	type: "", //2 types : LDAP, RADIUS

	//Common LDAP - Radius
	hostName: "",
	hostName2: "",
	ipAddress: "",
	ipAddress2: "",
	timeout: "",
	retries: "",
	preemption: "",
	countDownTimer: "",
	vrfName: "",

	//Common attribute LDAP && TACAC
	port: "",
	//Common attribute Radius - TACACS

	secret: "",
	isSecretChanged: "",

	//LDAP
	dnName: "",

	password: "",
	searchBase: "",
	ssl: "",
	onPremiseServer: "",
	isPasswordChanged: "",

	//Radius
	authenticationMethod: "",
	authenticationPort: "",
	accountingPort: "",
	origin: "",
	onRadiusServer: "",
	upamRadiusType: "",
	tls: ""
};
