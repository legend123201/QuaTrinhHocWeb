const functions = require('../comparePropsInObjects/functions');

const bodyData = {
	managementMode: 'FullManagement',
	licenseMode: 'EXPIRE_LAST',
	devices: [],
	groupId: '690c1cf2fcf42a62b20a412b', // nếu là AOS thì cho field này là string rỗng là được
};

// for (let i = 0; i < 1000; i++) {
// 	bodyData.devices.push({
// 		serialNumber: `APPER000${i + 1}`,
// 		deviceFamily: 'AP',
// 	});
// }

for (let i = 0; i < 3; i++) {
	bodyData.devices.push({
		serialNumber: `ONDEVS1505N${String(i).padStart(4, "0")}`,
		deviceFamily: 'AP', // "AP" | "AOS"
	});
}

functions.writeToAFile(bodyData);
