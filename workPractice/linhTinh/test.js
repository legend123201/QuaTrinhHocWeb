const body = {
	ids: ["a38016f2-269a-45bd-9de8-6721c59f0682", "ds"],
};

const res = {
	data: [
		{
			data: {
				id: "ds",
			},
			message: "Execution not found.",
			status: 404,
		},
		{
			data: {
				createdAt: "2026-05-29T08:46:38Z",
				id: "a38016f2-269a-45bd-9de8-6721c59f0682",
				updatedAt: "2026-05-29T08:48:37Z",
				assignments: [
					{
						id: "1fc897bf-06b6-4258-8e70-7b76ab6e2e06",
						serialNumber: "ONDEVS1505N0002",
						status: "ABORTED",
						username: "admin",
					},
				],
				autoSendMail: false,
				createdBy: "tma_dev@ovng.com",
				endAt: "2026-05-29T08:48:38Z",
				executionCount: 0,
				name: "Execution001",
				paused: true,
				scheduler: {
					createdAt: "2026-05-29T08:46:38Z",
					id: "0463ee0e-01de-4fa3-a23e-eccf1c1758f1",
					updatedAt: "2026-05-29T08:48:37Z",
					endDate: "2026-06-20T00:00:00Z",
					hourInDay: 0,
					minute: 0,
					nextExecution: "2026-06-10T00:00:00Z",
					paused: true,
					repeat: "daily",
					startDate: "2026-06-10T00:00:00Z",
					timeZone: "UTC",
				},
				script: {
					id: "98e95de6-0a8e-4102-85f2-35b18ef1eb04",
					name: "CLIScript001",
					params: {},
				},
				status: "DISABLED",
				type: "SCHEDULED",
			},
			message: "Execution stop initiated.",
			status: 200,
			oldData: {
				createdAt: "2026-05-29T08:46:38Z",
				id: "a38016f2-269a-45bd-9de8-6721c59f0682",
				updatedAt: "2026-05-29T08:46:38Z",
				assignments: [
					{
						id: "1fc897bf-06b6-4258-8e70-7b76ab6e2e06",
						serialNumber: "ONDEVS1505N0002",
						status: "PENDING",
						username: "admin",
					},
				],
				autoSendMail: false,
				createdBy: "tma_dev@ovng.com",
				executionCount: 0,
				name: "Execution001",
				paused: false,
				scheduler: {
					createdAt: "2026-05-29T08:46:38Z",
					id: "0463ee0e-01de-4fa3-a23e-eccf1c1758f1",
					updatedAt: "2026-05-29T08:46:38Z",
					endDate: "2026-06-20T00:00:00Z",
					hourInDay: 0,
					minute: 0,
					nextExecution: "2026-06-10T00:00:00Z",
					paused: false,
					repeat: "daily",
					startDate: "2026-06-10T00:00:00Z",
					timeZone: "UTC",
				},
				script: {
					id: "98e95de6-0a8e-4102-85f2-35b18ef1eb04",
					name: "CLIScript001",
					params: {},
				},
				status: "PENDING",
				type: "SCHEDULED",
			},
		},
	],
	message: "Some executions failed to stop.",
	status: 207,
};
