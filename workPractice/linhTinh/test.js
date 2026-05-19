const a = {
	devices: [
		{
			serialNumber: "SSZ212904271",
			assignmentType: "UNASSIGN", // API create thì ko có field này
		},
		{
			serialNumber: "JSZ23290037P",
			credential: {
				username: "honey",
				password: "baby",
			},
			useLastCredential: true,
			assignmentType: "ASSIGN", // API create thì ko có field này
		},
	],
};

const b = {
	deviceCredentials: [
		{
			serialNumber: "JSZ23290037P",
			credential: {
				username: "honey",
				password: "baby",
			},
		},
        {
			serialNumber: "PSZ23290037P",
			credential: {
				username: "honey2",
				password: "baby2",
			},
		},
	],
};
