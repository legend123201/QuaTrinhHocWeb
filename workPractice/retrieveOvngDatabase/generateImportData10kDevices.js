const functions = require('../comparePropsInObjects/functions');

const bodyData = {
	managementMode: 'FullManagement',
	licenseMode: 'EXPIRE_LAST',
	devices: [],
	groupId: '666a5eebfe85548682b29102', // nếu là AOS thì cho field này là string rỗng là được
};

// for (let i = 0; i < 1000; i++) {
// 	bodyData.devices.push({
// 		serialNumber: `APPER000${i + 1}`,
// 		deviceFamily: 'AP',
// 	});
// }

for (let i = 0; i < 5; i++) {
	bodyData.devices.push({
		serialNumber: `ONDEVS2002N${i + 1}`,
		deviceFamily: 'AP',
	});
}

functions.writeToAFile(bodyData);
