// - Trong JS có hashmap như java là Maps, nhưng mình cũng có thể dùng object để giả lập hashmap.
// Object cũng giống hashmap, có cặp key-value và key là duy nhất.
// Và mình có thể truy xuất key của object bằng cách Obj[tên field].

const _ = require('lodash');

// Mình lấy health threshold trên Infra bằng macAddress
// Infra trả về 1 mình 1 array gồm các obj với mỗi obj có 3 field là macAddress, cpuThreshold, memoryThreshold
// Mình cần ghi đè 2 thuộc tính từ Infra vào cái Dynamic, vậy thì mình tạo hashmap fake với key là macAddress vì mac unique
// Vậy thì tốn 1 vòng for để tạo hashmap. Sau đó mình chỉ cần 1 vòng for để ghi đè. 2 vòng for "ko lồng nhau". 
// (Ko dùng cách này thì phải dùng 2 vòng for lồng nhau tốn performance. Bởi vì cần 1 vòng lặp qua các device, 
// 1 vòng nữa lồng bên trong kiếm coi cái nào từ array Infra là có macAddress như nó)
let arrayHealthThreshold = [
    {
        macAddress: "DD:DD:DD:DD:DD:DD",
        cpuThreshold: 20,
        memoryThreshold: 50
    },
    {
        macAddress: "AA:AA:AA:AA:AA:AA",
        cpuThreshold: 10,
        memoryThreshold: 10
    },
    {
        macAddress: "BB:BB:BB:BB:BB:BB",
        cpuThreshold: 90,
        memoryThreshold: 90
    }
];

// cách 1 
let healthThresholdMapByMacAddress1 = {};
for (let healthThreshold of arrayHealthThreshold) {
    healthThresholdMapByMacAddress1[healthThreshold.macAddress] = healthThreshold;
}

// cách 2 (nếu có lodash)
let healthThresholdMapByMacAddress2 = _.keyBy(arrayHealthThreshold, 'macAddress');

console.log("Cach 1", healthThresholdMapByMacAddress1);
console.log("Cach 2", healthThresholdMapByMacAddress2);
// kết quả
// {
//     'DD:DD:DD:DD:DD:DD': {
//         macAddress: 'DD:DD:DD:DD:DD:DD',
//             cpuThreshold: 20,
//                 memoryThreshold: 50
//     },
//     'AA:AA:AA:AA:AA:AA': {
//         macAddress: 'AA:AA:AA:AA:AA:AA',
//             cpuThreshold: 10,
//                 memoryThreshold: 10
//     },
//     'BB:BB:BB:BB:BB:BB': {
//         macAddress: 'BB:BB:BB:BB:BB:BB',
//             cpuThreshold: 90,
//                 memoryThreshold: 90
//     }
// }

// ==================== BIẾN THỂ của hashmap (mỗi key có thể có nhiều element)
let bindingLicensesBody = [
    {
        orderId: "OVNG",
        duration: 12
    },
    {
        orderId: "OVNG",
        duration: 24
    },
    {
        orderId: "OVC",
        duration: 12
    },
    {
        orderId: "OVC",
        duration: 36
    },
    {
        orderId: "OVB",
        duration: 12
    }
];

// cách 1: lọc qua từng phần tử rồi add vào object, cách này ko cần demo.

// cách 2 (nếu có lodash)
let bindingLicenses = _.groupBy(bindingLicensesBody, 'orderId');
let orderIds = Object.getOwnPropertyNames(bindingLicenses);

for (let orderId of orderIds) {
    console.log("Elements group by orderId: " + orderId);
    console.log(bindingLicenses[orderId]);
}
// Elements group by orderId: OVNG
// [
//     { orderId: 'OVNG', duration: 12 },
//     { orderId: 'OVNG', duration: 24 }
// ]
// Elements group by orderId: OVC
// [{ orderId: 'OVC', duration: 12 }, { orderId: 'OVC', duration: 36 }]
// Elements group by orderId: OVB
// [{ orderId: 'OVB', duration: 12 }]

console.log("bindingLicenses", bindingLicenses);
// {
//     OVNG: [
//         { orderId: 'OVNG', duration: 12 },
//         { orderId: 'OVNG', duration: 24 }
//     ],
//     OVC: [
//         { orderId: 'OVC', duration: 12 },
//         { orderId: 'OVC', duration: 36 }
//     ],
//     OVB: [{ orderId: 'OVB', duration: 12 }]
// }

console.log("orderIds", orderIds);
// [ 'OVNG', 'OVC', 'OVB' ]

// Ứng dụng khác: 
// + Dùng để kiếm phần tử có số lần xuất hiện ít nhất trong array.