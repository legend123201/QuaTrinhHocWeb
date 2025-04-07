// hàm của chị Ly copy từ OVC qua
// hàm này chỉ có 0 và 1, nó sẽ trả về 1 nếu a >= b, trả về 0 nếu a < b (với a là currentVersion, b là neededVersion)
// nó so sánh 5 phần theo độ ưu tiên như sau: 1 > 2 > 3 > 5 > 4, nghĩa là phần 4 nhỏ hơn nhưng phần 5 lớn hơn thì nó vẫn là lớn hơn
// public static int compareVersion(String currentVersion, String neededVersion) {

// 	String[] neededVersionArray = neededVersion.split("\\.");
// 	String[] currentVersionArray = currentVersion.split("\\.");
// 	for (int i = 0; i < 4; i++) {
// 		if (Integer.parseInt(neededVersionArray[i]) > Integer.parseInt(currentVersionArray[i])) { // b[i] > a[i] => 0
// 			//7.3.2.123.R02 > 7.3.2.150.R01
// 			if (i == 3 && Integer.parseInt(currentVersionArray[4].substring(1)) > Integer.parseInt(neededVersionArray[4].substring(1))) { // i = 3 (a[3] < b[3]) và a[4] > b[4] => 1
// 				return 1;
// 			}
// 			return 0;
// 		} else if (Integer.parseInt(neededVersionArray[i]) < Integer.parseInt(currentVersionArray[i])) { // b[i] < a[i] => a > b
// 			return 1;
// 		}
// 	}

// 	if (Integer.parseInt(neededVersionArray[4].substring(1)) > Integer.parseInt(currentVersionArray[4].substring(1))) { // cả 4 phần trước đều bằng nhau và b[4] > a[4] => a = b
// 		return 0;
// 	}

// 	return 1; // 4 phần đầu bằng nhau hết và a[4] >= b[4] => 1
// }

// license mới đc import
const licenseJustImported = {
	_id: ObjectId('650abbd18afd3900e87259e0'),
	licenseId: '93bedb27-58e5-4668-bcaf-35636776c159',
	startDate: null,
	endDate: null,
	duration: NumberInt(24),
	order: ObjectId('650abbd18afd3900e87259df'),
	orderId: 'OVC-202304000454',
	orgId: 'OVNG-6493c30f40f785abf15f9fb2-EMEA',
	state: 'idle',
	status: 'AVAILABLE_NEVER_USED',
	createdAt: ISODate('2023-09-20T09:30:57.398+0000'),
	updatedAt: ISODate('2023-09-20T09:30:57.398+0000'),
	gracePeriod: NumberInt(0),
	associateStatus: null,
};

// license khi mới gọi qua SM activate
const licenseIsWaitingActivationFromSM = {
	_id: ObjectId('650abbd18afd3900e87259e0'),
	licenseId: '93bedb27-58e5-4668-bcaf-35636776c159',
	startDate: null,
	endDate: null,
	duration: NumberInt(24),
	order: ObjectId('650abbd18afd3900e87259df'),
	orderId: 'OVC-202304000454',
	orgId: 'OVNG-6493c30f40f785abf15f9fb2-EMEA',
	state: 'idle',
	status: 'BEING_BOUND', // => khác so với lúc mới import
	createdAt: ISODate('2023-09-20T09:30:57.398+0000'),
	updatedAt: ISODate('2023-09-20T09:36:07.507+0000'), // => khác so với lúc mới import
	gracePeriod: NumberInt(0),
	associateStatus: null,
};

// license sau khi SM activate thành công, SM gọi webhook
const licenseAfterSMCallWebhook = {
	_id: ObjectId('650abbd18afd3900e87259e0'),
	licenseId: '93bedb27-58e5-4668-bcaf-35636776c159',
	startDate: '2023-09-20', // => khác so với lúc mới import
	endDate: '2025-09-20', // => khác so với lúc mới import
	duration: NumberInt(24),
	order: ObjectId('650abbd18afd3900e87259df'),
	orderId: 'OVC-202304000454',
	orgId: 'OVNG-6493c30f40f785abf15f9fb2-EMEA',
	state: 'active', // => khác so với lúc mới import
	status: 'BOUND_IN_OPERATION_PERIOD', // => khác so với lúc mới import
	createdAt: ISODate('2023-09-20T09:30:57.398+0000'),
	updatedAt: ISODate('2023-09-20T09:38:55.353+0000'), // => khác so với lúc mới import nhưng ko quan trọng
	gracePeriod: NumberInt(30), // => khác so với lúc mới import
	associateStatus: null, // => chỗ này đúng ra sẽ là BINDING_SUCCESS, trên system dev mà ko chạy SM Simulator thì sẽ là BINDING_FAIL
};

// device khi chưa assign license
const fieldsRelateToLicenseWhenUnlicensed = {
	license: null,
	licenseStatus: 'UNLICENSED',
	markPremium: false,
};

// device khi đang đợi activate license cho nó
const fieldsRelateToLicenseWhenWaitingSMCallWebhook = {
	license: ObjectId('650abbd18afd3900e87259e0'),
	licenseStatus: 'BEING_LICENSED',
	markPremium: false, 
	// mình nghĩ markPremium sẽ luôn luôn là false dù code là sẽ ko update giá trị của field này (giữ giá trị cũ). Vì:
	// + Case upgrade từ trial lên paid, thì license bị xóa hết, device về unlicense hết.
	// + Case bind cho device chưa có license => tất nhiên device đang unlicense
	// + Case bind cho device đã có license (reassign device, reassign license) => thì trước khi bind/activate thì nó cũng unbind rồi, device trở thành unlicense rồi mới đem đi bind/activate.
};

// device khi đã assign license
const fieldsRelateToLicenseWhenLicensed = {
	license: ObjectId('650abbd18afd3900e87259e0'),
	licenseStatus: 'LICENSED',
	markPremium: true,
};




