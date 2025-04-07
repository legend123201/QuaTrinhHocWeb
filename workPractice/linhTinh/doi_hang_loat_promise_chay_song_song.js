let devices = await Device.find({
    site: siteId,
    group: groupId
}).populate("site").populate("devicegroup").populate("license")
.sort('updatedAt DESC');

let promises = [];

// retrieve buildings of devices
// bỏi vì hàm async sẽ luôn trả về 1 promise, nên trong hàm dưới ko có return, thì nó sẽ trả về Promise<void>
promises.push(...(devices.map(async (device) => {
    device.building = await Group.findOne({
        id : device.building
    });
})));

// retrieve buildings of devices
promises.push(...(devices.map(async (device) => {
    device.floor = await Group.findOne({
        id : device.floor
    });
})));

await Promise.all(promises);

if (devices && devices.length){
    enrichedDevices = await this.retrieveDynamicAttributesForDevice(devices);
};