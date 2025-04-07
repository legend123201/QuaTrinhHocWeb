// RUN THIS FIRST ((tránh lỗi pod ko phải là primary)):

// case 1: kubectl port-forward pods/mongodb-0 28015:27017 (port bên trái là port expose, bên phải là port targeted, có thể dùng cho các resource khác như service, deployment,...)

// TH dùng service: thay "pods/mongodb-0" => "service/mongodb-service" => xem danh sách được, nhưng thêm/xóa/sửa nó báo lỗi "not primary", vậy là service chọn pod ko phải primary rồi @@
// case 2: kubectl port-forward pods/mongodb-0 27017:27017 (giữ nguyên port cũ cho dễ) => ko dùng được, vẫn phải dùng case 1 :v

const { MongoClient, ObjectId } = require("mongodb");
const functions = require("../comparePropsInObjects/functions");
const _ = require("lodash");

// constant
// const connectionString = "mongodb://localhost:28015/?directConnection=true"; // (case 1)
// const connectionString = "mongodb://localhost:27017/?directConnection=true"; // (case 2)
const connectionString = "mongodb://11.11.7.151:27017/?directConnection=true"; // DoopL MongoDB
// const connectionString = "mongodb://172.16.90.101:32717/?directConnection=true";
const client = new MongoClient(connectionString);
// const dbName = "ovng";
const dbName = "doopl";

async function main() {
	try {
		await client.connect();
		console.log("Connected successfully to server");
		const db = await client.db(dbName);

		await dynamicFunction(db);
		// await onboardDevices(db);
		// fakeOnDevice(db); // Xài hàm này thì nhớ comment dòng code "client.close();", ko xài thì un-comment lại

		// await deleteOrderAndLicensesInOrder(db);
		// await changeDeviceStatusToTheTimeNotActivateNotBindToEachOther(db, devicesInOrg);
		// await changeLicenseStatusToTheTimeNotActivateNotBindToEachOther(db, licensesInOrg);
		// await changeLicenseAndDeviceStatusToTheTimeJustRequestActivation(db);
		// await changeLicenseAndDeviceStatusToTheTimeBindSuccessful(db);
	} catch (error) {
		console.log(error);
	} finally {
		client.close();
	}
}

/**
 * hàm này mình sẽ query database này kia cho nhanh
 * @param {*} db
 */
const dynamicFunction = async (db) => {
	let res, res1, res2, res3, res4;

	res = await db.collection("notifications").find({}).sort({ createdAt: -1 }).toArray();
	const stringDataRecords = [];
	const stringDataRecordIds = [];
	res.forEach((e) => {
		if (typeof e.data === "string") {
			stringDataRecords.push(e);
			stringDataRecordIds.push(new ObjectId(e._id));
		}
	});

	res1 = await db.collection("notifications").deleteMany({ _id: { $in: stringDataRecordIds } });

	functions.writeToAFile({ res: stringDataRecordIds, res1 });

	// Tạo 1 VC of 2
	/*
	let res = await db
		.collection("device")
		.find({ serialNumber: { $in: ["ONDEVS0212N1", "ONDEVS0212N2"] } })
		.limit(10)
		.sort({ createdAt: -1 })
		.toArray();

	let res1 = await db
		.collection("devicedynamicattribute")
		.find({ serialNumber: { $in: ["ONDEVS0212N1", "ONDEVS0212N2"] } })
		.limit(10)
		.sort({ createdAt: -1 })
		.toArray();

	let res2 = await db.collection("device").updateMany(
		{ serialNumber: { $in: ["ONDEVS0212N1", "ONDEVS0212N2"] } },
		{
			$set: {
				calculatedMacAddress: "02:12:24:FF:FF:01",
				vcSerialNumber: "ONDEVS0212N1"
			}
		}
	);

	let res3 = await db.collection("devicedynamicattribute").updateMany(
		{ serialNumber: { $in: ["ONDEVS0212N1"] } },
		{
			$set: {
				modelName: "OS6860E-24",
				licenseCategory: "OVCX-68",
				calculatedMacAddress: "02:12:24:FF:FF:01",
				chassisInfo: [
					{
						macAddress: "02:12:24:FF:FF:02",
						serialNumber: "ONDEVS0212N2",
						modelName: "OS6860E-24",
						role: "master",
						partNumber: "903708-90",
						vcName: "ONDEVS0212N1 [1/2]"
					},
					{
						macAddress: "02:12:24:FF:FF:01",
						serialNumber: "ONDEVS0212N1",
						modelName: "OS6860E-24",
						role: "slave",
						partNumber: "903708-90",
						vcName: "ONDEVS0212N1 [2/2]"
					}
				],
				deviceLicenseMode: "CAPEX",
				deviceRole: "slave",
				partNumber: "903708-90",
				vcMacAddress: "02:12:24:FF:FF:02",
				vcSerialNumber: "ONDEVS0212N1"
			}
		}
	);

	let res4 = await db.collection("devicedynamicattribute").updateMany(
		{ serialNumber: { $in: ["ONDEVS0212N2"] } },
		{
			$set: {
				modelName: "OS6860E-24",
				licenseCategory: "OVCX-68",
				calculatedMacAddress: "02:12:24:FF:FF:01",
				chassisInfo: null,
				deviceLicenseMode: "CAPEX",
				deviceRole: "master",
				partNumber: "903708-90",
				vcMacAddress: "02:12:24:FF:FF:02",
				vcSerialNumber: "ONDEVS0212N1"
			}
		}
	);
	*/
};

const onboardDevices = async (db) => {
	// Get the current date time
	const date = new Date();
	let dd = date.getDate();
	let mm = date.getMonth() + 1;
	let yy = date.getFullYear().toString().slice(2);

	// Custom with the format "xx"
	if (dd < 10) dd = "0" + dd;
	if (mm < 10) mm = "0" + mm;
	if (yy < 10) yy = "0" + yy;

	const generatedDeviceInfo = (serialNumber, sequenceNumber, isApDevice) => {
		// Custom with the format "xx"
		if (sequenceNumber < 10) sequenceNumber = "0" + sequenceNumber;

		// Now calculate and return
		return {
			modelName: isApDevice ? "OAW-AP1201" : "OS6860E-P48",
			currentRunningSoftwareVersion: isApDevice ? "4.0.6.7" : "8.10.38.R01",

			macAddress: `${dd}:${mm}:${yy}:FF:FF:${sequenceNumber}`, // dd:mm:yy:[FF:FF]:stt
			bleMac: `${dd}:${mm}:${yy}:FF:FF:${sequenceNumber}`, // dd:mm:yy:[FF:FF]:stt
			ipv4Address: `1${dd}.1${mm}.1${yy}.1${sequenceNumber}`, // 1dd:1mm:1yy:1stt
			name: `Device ${serialNumber}`,

			lastHeartBeat: Math.floor(new Date().getTime() / 1000.0),
			activationStatus: "OV Managed",
			deviceManaged: true
		};
	};

	const serialNumberRegex = `ONDEVS${dd}${mm}N`; // Format: 'ONDEVS' + ddmm + 'N' ('ONDEVS': ON DEVICE, 'N': NUMBER)
	const isApDevice = false;
	const numberOfDevices = 100;
	const promises = [];

	for (let i = 1; i <= numberOfDevices; i++) {
		const serialNumber = serialNumberRegex + i;
		promises.push(
			db.collection("devicedynamicattribute").updateMany(
				{ serialNumber: { $in: [serialNumber] } },
				{
					$set: generatedDeviceInfo(serialNumber, i, isApDevice)
				}
			)
		);
	}

	const res = await Promise.all(promises);
	functions.writeToAFile({ res });
};

const fakeOnDevice = (db) => {
	const intervalFunc = async () => {
		let res = await db.collection("devicedynamicattribute").updateMany(
			{
				$or: [{ serialNumber: { $regex: "ONDEVS" } }, { serialNumber: { $regex: "NEIGHBORAPS" } }]
			},
			{
				$set: {
					lastHeartBeat: Math.floor(new Date().getTime() / 1000.0),
					deviceManaged: true,
					activationStatus: "OV Managed"
				}
			}
		);
		functions.writeToAFile({ res });
		console.log("Run! " + Math.floor(new Date().getTime()));
	};

	// Call the first time manually
	intervalFunc();
	setInterval(intervalFunc, 59000); //59s
};

// ========================== CODE MẪU ===================================
// --------------------------------------------------------- LẤY DANH SÁCH CÁC COLLECTIONS
// let res = await db.listCollections().toArray();
// res = res.map(e => e.name).filter(e => e?.includes("site"));

// --------------------------------------------------------- CODE MẪU GET RECORD
// let res = await db
// 	.collection('devicedynamicattribute')
// 	.find({ vpnServers: { $exists: true, $nin: ['', null, "iBeacon"] } }, { projection: { bridgeFarEndApIp: 1, _id: 0 } })
//  .limit(10)
//  .sort({ createdAt: -1 })
// 	.toArray();

// --------------------------------------------------------- CODE MẪU CREATE RECORD
// let res = await db.collection('organization').insertMany([{
// 	name: "testtest"
// }]);

// --------------------------------------------------------- CODE MẪU UPDATE RECORD
// let res = await db.collection('devicedynamicattribute').updateMany(
// 	{ serialNumber: { $in: ['AOSDEVICE04'] } },
// 	{
// 		$set: {
// 			modelName: 'OS6860E-P48', // AP: "OAW-AP1201"
// 			lastHeartBeat: Math.floor(new Date().getTime() / 1000.0),
// 			deviceManaged: true,
// 			macAddress: '31:05:24:FF:FF:04', // dd:mm:yy:[FF:FF]:stt
// 			bleMac: '31:05:24:FF:FF:04',
// 			ipv4Address: '131.105.124.104', // 1dd:1mm:1yy:1stt
// 			name: 'Device AOSDEVICE04',
// 			currentRunningSoftwareVersion: '8.10.38.R01', // AP: "4.0.6.7"
// 			activationStatus: "OV Managed", // "vpnConfigFailed", "OV Managed"
// 			chassisInfo: [
// 				{
// 					macAddress: '31:05:24:FF:FF:04',
// 					serialNumber: 'AOSDEVICE04',
// 					modelName: 'OS6860E-P48',
// 					role: 'master',
// 					partNumber: '903711-90',
// 					vcName: 'AOSDEVICE04 [1/1]',
// 				},
// 			],
// 		},
// 	},
// );

// --------------------------------------------------------- CODE MẪU DELETE RECORD
// let res = await db.collection('user').deleteMany({ email: "ovngdev@gmail.com" });
// ====================================================================================

/**
 * xóa order và các license của nó
 * @param {*} db
 */
const deleteOrderAndLicensesInOrder = async (db) => {
	const data = {
		orderId: "OVC-202304000454"
	};

	const resDeleteOrder = await db.collection("order").deleteMany({ orderId: data.orderId });
	console.log("resDeleteOrder", resDeleteOrder);
	const resDeleteLicenses = await db.collection("license").deleteMany({ orderId: data.orderId });
	console.log("resDeleteLicenses", resDeleteLicenses);
};

/**
 * đổi license và device thành trạng thái đang đợi SM call webhook sau khi OVNG gọi SM để activate license
 * @param {*} db
 */
const changeLicenseAndDeviceStatusToTheTimeJustRequestActivation = async (db) => {
	// data là những field sẽ thay đổi tùy license và device
	const data = {
		licenseId: "93bedb27-58e5-4668-bcaf-35636776c159",
		licenseIdMongo: new ObjectId("650ac8568afd3900e87259f2"),
		serialNumber: "TRONGTEST002"
	};

	const resUpdateLicense = await db.collection("license").updateMany({ licenseId: data.licenseId }, { $set: { status: "BEING_BOUND" } });
	console.log("resUpdateLicense", resUpdateLicense);
	const resUpdateDevice = await db.collection("device").updateMany(
		{ serialNumber: data.serialNumber },
		{
			$set: {
				license: data.licenseIdMongo,
				licenseStatus: "BEING_LICENSED",
				markPremium: true
			}
		}
	);
	console.log("resUpdateDevice", resUpdateDevice);
};

/**
 * đổi license và device thành trạng thái đã bind với nhau thành công
 * @param {*} db
 */
const changeLicenseAndDeviceStatusToTheTimeBindSuccessful = async (db) => {
	// data là những field sẽ thay đổi tùy license và device
	const data = {
		licenseId: "93bedb27-58e5-4668-bcaf-35636776c159",
		licenseIdMongo: new ObjectId("650ac8568afd3900e87259f2"),
		startDate: "2023-09-20",
		endDate: "2025-09-20",
		gracePeriod: 30,
		serialNumber: "TRONGTEST002"
	};

	const resUpdateLicense = await db.collection("license").updateMany(
		{ licenseId: data.licenseId },
		{
			$set: {
				startDate: data.startDate,
				endDate: data.endDate,
				state: "active",
				status: "BOUND_IN_OPERATION_PERIOD",
				gracePeriod: data.gracePeriod,
				associateStatus: "BINDING_SUCCESS" // => chỗ này đúng ra sẽ là BINDING_SUCCESS, trên system dev mà ko chạy SM Simulator thì sẽ là BINDING_FAIL
			}
		}
	);
	console.log("resUpdateLicense", resUpdateLicense);
	const resUpdateDevice = await db.collection("device").updateMany(
		{ serialNumber: data.serialNumber },
		{
			$set: {
				license: data.licenseIdMongo,
				licenseStatus: "LICENSED",
				markPremium: true
			}
		}
	);
	console.log("resUpdateDevice", resUpdateDevice);
};

/**
 * đổi license thành trạng thái ban đầu khi chưa active, chưa bind gì cả
 * @param {*} db
 */
const changeLicenseStatusToTheTimeNotActivateNotBindToEachOther = async (db, licenses) => {
	for (let i = 0; i < licenses.length; i++) {
		// data là những field sẽ thay đổi tùy license
		const data = {
			licenseId: licenses[i].licenseId
		};

		const resUpdateLicense = await db.collection("license").updateMany(
			{ licenseId: data.licenseId },
			{
				$set: {
					startDate: null,
					endDate: null,
					state: "idle",
					status: "AVAILABLE_NEVER_USED",
					gracePeriod: 0,
					associateStatus: null
				}
			}
		);

		functions.writeToAFile("---------resUpdateLicense: " + licenses[i].licenseId);
		functions.writeToAFile(resUpdateLicense);
	}
};

/**
 * đổi device thành trạng thái ban đầu khi chưa bind gì cả
 * @param {*} db
 */
const changeDeviceStatusToTheTimeNotActivateNotBindToEachOther = async (db, devices) => {
	for (let i = 0; i < devices.length; i++) {
		// data là những field sẽ thay đổi tùy device
		const data = {
			serialNumber: devices[i].serialNumber
		};

		const resUpdateDevice = await db.collection("device").updateMany(
			{ serialNumber: data.serialNumber },
			{
				$set: {
					license: null,
					licenseStatus: "UNLICENSED",
					markPremium: false
				}
			}
		);

		functions.writeToAFile("---------resUpdateDevice: " + devices[i].serialNumber);
		functions.writeToAFile(resUpdateDevice);
	}
};

main();
