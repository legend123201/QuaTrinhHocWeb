module.exports = {
	id: {
		type: "string",
		description: "The id of the AAA Profile."
	},
	aaaProfileName: {
		type: "string",
		description: "The name of AAA Profile."
	},
	cpAccServer: {
		type: "object",
		description: "The Captive Portal Access Server of the AAA Profile",
		properties: {
			callingStationIdType: {
				type: "string",
				description: "The calling station Id type of the AAA Profile"
			},
			syslogIpAddress: {
				type: "string",
				description: "The syslog IP Address of the AAA Profile."
			},
			syslogUpdPort: {
				type: "integer",
				description: "The syslog up port of the AAA Profile."
			},
			primaryServer: {
				type: "string",
				description: "The primary of the AAA Profile."
			},
			secondaryServer: {
				type: "string",
				description: "The secondary server of the AAA Profile."
			},
			thirdServer: {
				type: "string",
				description: "The third server of the AAA Profile."
			},
			fourthServer: {
				type: "string",
				description: "The fourth server of the AAA Profile."
			}
		}
	},
	cpAuthServer: {
		type: "object",
		description: "The Captive Portal of the AAA Profile.",
		properties: {
			primaryServer: {
				type: "string",
				description: "The primary server of the AAA Profile."
			},
			secondaryServer: {
				type: "string",
				description: "The secondary server of the AAA Profile."
			},
			thirdServer: {
				type: "string",
				description: "The third server of the AAA Profile."
			},
			fourthServer: {
				type: "string",
				description: "The fourth server of captive portal server."
			}
		}
	},
	cpOpts: {
		type: "object",
		description: "The Captive Portal of the AAA Profile.",
		properties: {
			inactivityLogout: {
				type: "boolean",
				description: "The Inactivity Interval of the Captive Portal."
			},
			inactivityLogoutInterval: {
				type: "integer",
				description: "The Inactivity logout interval of the Captive Portal."
			},
			interiumInterval: {
				type: "integer",
				description: "The interium interval of the Captive Portal."
			},
			interiumIntervalTrustRadStatus: {
				type: "boolean",
				description: "The interium Interval of the Captive Portal."
			},
			sessionTimeout: {
				type: "boolean",
				description: "The session timeout of the Captive Portal."
			},
			sessionTimeoutInterval: {
				type: "integer",
				description: "The session timeout interval of the Captive Portal."
			},
			sessionTimeoutTrustRadStatus: {
				type: "boolean",
				description: "The session timeout trust radius status of the Captive Portal. "
			}
		}
	},
	e02d1xAccServer: {
		type: "object",
		description: "The 802.1X of the AAA Profile.",
		properties: {
			callingStationIdType: {
				type: "string",
				description:
					"The RADIUS Calling Station ID attribute for MAC accounting sessions (MAC - sets the Calling Station ID to the MAC address of the user. IP - sets the Calling Station ID to the IP address of the user)."
			},
			syslogIpAddress: {
				type: "string",
				description: "The IP address of the Syslog Accounting Server."
			},
			syslogUpdPort: {
				type: "integer",
				description:
					"The port used to communicate with the Syslog Accounting Server (Default = 514)"
			},
			primaryServer: {
				type: "string",
				description: "The primary server of the 802.1X."
			},
			secondaryServer: {
				type: "string",
				description: "The secondary server of the 802.1X."
			},
			thirdServer: {
				type: "string",
				description: "The third server of the 802.1X."
			},
			fourthServer: {
				type: "string",
				description: "The fourth server of the 802.1X."
			}
		}
	},
	e02d1xAuthServer: {
		type: "object",
		description: "The 802.1X of the AAA Profile.",
		properties: {
			primaryServer: {
				type: "string",
				description: "The primary server of the 802.1X"
			},
			secondaryServer: {
				type: "string",
				description: "The secondary server of the 802.1X."
			},
			thirdServer: {
				type: "string",
				description: "The third server of the 802.1X."
			},
			fourthServer: {
				type: "string",
				description: "The fourth server of the 802.1X."
			}
		}
	},
	e02d1xOpts: {
		type: "object",
		description: "The 802.1X of the AAA Profile.",
		properties: {
			interiumInterval: {
				type: "integer",
				description: "The interium interval of the 802.1X"
			},
			interiumIntervalTrustRadStatus: {
				type: "boolean",
				description: "The interium interval trust radius status of the 802.1X."
			},
			reAuthInterval: {
				type: "integer",
				description:
					"The re-Authentication Interval of the 802.1X.(Range = 600 - 7200, Default = 3600)"
			},
			reAuthSts: {
				type: "boolean",
				description: "The re-Authentication status of the 802.1X."
			},
			reAuthTrustRadStatus: {
				type: "boolean",
				description:
					"Enables/Disables the Session Timeout Trust Radius option for 802.1x Authenticated users.(Default = Disabled)."
			}
		}
	},
	macAccServer: {
		type: "object",
		description: "The Mac Accounting server of the AAA Profile.",
		properties: {
			callingStationIdType: {
				type: "string",
				description:
					"The RADIUS Calling Station ID attribute for MAC accounting sessions (MAC - sets the Calling Station ID to the MAC address of the user. IP - sets the Calling Station ID to the IP address of the user)."
			},
			syslogIpAddress: {
				type: "string",
				description: "The syslog IP Address of the Mac Accounting."
			},
			syslogUpdPort: {
				type: "integer",
				description: "The syslog Up Port of the Mac Accounting."
			},
			primaryServer: {
				type: "string",
				description: "The primary server of the Mac Accounting."
			},
			secondaryServer: {
				type: "string",
				description: "The secondary server of the Mac Accounting."
			},
			thirdServer: {
				type: "string",
				description: "The third server of the Mac Accounting."
			},
			fourthServer: {
				type: "string",
				description: "The fourth of the Mac Accounting."
			}
		}
	},
	macAuthOpts: {
		type: "object",
		description: "The Mac authentication of the AAA Profile.",
		properties: {
			inactivityLogout: {
				type: "boolean",
				description: "The inactivity logout of the Mac Authentication."
			},
			inactivityLogoutInterval: {
				type: "integer",
				description: "The inactivity logout of the Mac Authentication."
			},
			interiumInterval: {
				type: "integer",
				description: "The interium interval of the Mac Authentication."
			},
			interiumIntervalTrustRadStatus: {
				type: "boolean",
				description: "The interium interval trust radius status of the Mac Authentication."
			},
			sessionTimeout: {
				type: "boolean",
				description: "The session timeout of the Mac Authentication."
			},
			sessionTimeoutInterval: {
				type: "integer",
				description: "The session timeout interval of the Authentication."
			},
			sessionTimeoutTrustRadStatus: {
				type: "boolean",
				description: "The session timeout trust radius status of the Authentication."
			}
		}
	},
	macAuthServer: {
		type: "object",
		description: "The Mac authentication of the AAA Profile.",
		properties: {
			primaryServer: {
				type: "string",
				description: "The primary server of the Mac Authentication."
			},
			secondaryServer: {
				type: "string",
				description: "The secondary server of the Mac Authentication."
			},
			thirdServer: {
				type: "string",
				description: "The third server of the Mac Authentication."
			},
			fourthServer: {
				type: "string",
				description: "The fourth server of the Mac Authentication."
			}
		}
	},
	radOpts: {
		type: "object",
		description: "The Radius of the AAA Profile.",
		properties: {
			calledStnDelim: {
				type: "string",
				description: "The delimiter character used to separate fields within a Called Station ID."
			},
			calledStnIdCase: {
				type: "string",
				description: "Indicates if the Called Station ID must be in Upper Case or Lower Case."
			},
			callingStnDelim: {
				type: "string",
				description: "The delimiter character used to separate fields within a Calling Station ID."
			},
			callingStnIdCase: {
				type: "string",
				description: "Indicates if the Calling Station ID must be in Upper Case or Lower Case."
			},
			nasIdentifier: {
				type: "string",
				description:
					"The RADIUS client NAS-Identifier attribute for authentication and accounting sessions. A text string (up to 31 characters) is used to identify the switch (RADIUS client) in the NAS-Identifier attribute."
			},
			nasPortId: {
				type: "string",
				description:
					"- The RADIUS client NAS-Port attribute for authentication and accounting sessions. A text string (up to 31 characters) is used to define a NAS-Port identifier for the NAS-Port attribute."
			},
			passwordCase: {
				type: "string",
				description: "Indicates if the RADIUS Server Password must be in Upper Case or Lower Case."
			},
			passwrdDelim: {
				type: "string",
				description:
					"The delimiter character used to separate fields within a RADIUS Server Password."
			},
			userNameCase: {
				type: "string",
				description: "Indicates if the RADIUS Server User Name must be in Upper Case or Lower Case."
			},
			userNameDelim: {
				type: "string",
				description:
					"The delimiter character used to separate fields within a RADIUS Server User Name."
			},
			calledStnId: {
				type: "string",
				description: "The called station ID of the profile."
			},
			calledStnIdSepar: {
				type: "string",
				description: "The called station ID separ of the profile."
			},
			customCalledStnId: {
				type: "string",
				description: "Configure custom called station ID of the profile."
			}
		}
	},
	quickOpts: {
		type: "object",
		description: "The quick options of the AAA Profile.",
		properties: {
			selectPrimaryAuth: {
				type: "string",
				description: "Select the primary authentication server of the AAA Profile."
			},
			useSelectPriAuthFor8021x: {
				type: "boolean",
				description: "True if the user uses this authentication server for 802.1x."
			},
			useSelectPriAuthForMac: {
				type: "boolean",
				description: "True if the user uses this authentication server for MAC."
			},
			useSelectPriAuthForCp: {
				type: "boolean",
				description: "True if the user uses this authentication server for captive portal."
			},
			selectPrimaryAcc: {
				type: "string",
				description: "Select the primary accounting server of the AAA Profile."
			},
			useSelectPriAccFor8021x: {
				type: "boolean",
				description: "True if the user uses this primary accounting server for 802.1x."
			},
			useSelectPriAccForMac: {
				type: "boolean",
				description: "True if the user uses this primary accounting server for MAC."
			},
			useSelectPriAccForCp: {
				type: "boolean",
				description: "True if the user uses this primary accounting server for captive portal."
			},
			openAdvancedSettings: {
				type: "boolean",
				description: "True if the user opens advanced settings of the AAA Profile."
			}
		}
	},
	childStatus: {
		type: "boolean",
		description: "The child status of the profile."
	}
};
