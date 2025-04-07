const consoleLogForms = require("./consoleLogForms");
const functions = require("./functions");
const detailsDeviceById = require("./objects/detailsDeviceById");
const getDeviceById = require("./objects/getDeviceById");
const getAllDevicesFromOrganization = require("./objects/getAllDevicesFromOrganization");
const getAllDevices = require("./objects/getAllDevices");

const { ObjectId, NumberLong, ISODate, NumberInt } = functions.fakeFunctionForFormat;

const test = () => {
    try {
        const deviceAndDynamicAndExtra_detailsDeviceById = {
            ...detailsDeviceById.studio3T_device,
            ...detailsDeviceById.studio3T_devicedynamicattribute,
            // ...detailsDeviceById.extra_when_get_details
        };

        const deviceAndDynamicAndExtra_getDeviceById = {
            ...detailsDeviceById.studio3T_device,
            ...detailsDeviceById.studio3T_devicedynamicattribute,
            ...getDeviceById.extraWhenGetDeviceById
        };

        const deviceAndDynamicAndExtra_getAllDevicesFromOrganization = {
            ...detailsDeviceById.studio3T_device,
            ...detailsDeviceById.studio3T_devicedynamicattribute,
            ...getAllDevicesFromOrganization.extraWhenGetAllDevicesFromOrg
        };

        const deviceAndDynamicAndExtra_getAllDevices = {
            ...detailsDeviceById.studio3T_device,
            ...detailsDeviceById.studio3T_devicedynamicattribute,
            ...getAllDevices.extraWhenGetAllDevices
        };


        let objectPairsArray = [
            {
                title: "route: detailsDeviceById - prop: all - area: Postman (txt) VS Postman (mine) 3",
                object1Area: "Postman (txt)",
                object2Area: "Postman (mine) 3",
                object1: detailsDeviceById.postman_txt,
                object2: detailsDeviceById.postman_mine3
            }, // postman_txt nhiều hơn 3 cái: 'meshLevel', 'rootMacAddress', và 'apLocation'

            {
                title: "route: detailsDeviceById - prop: all - area: studio3T_device VS basic_device_obj",
                object1Area: "studio3T_device",
                object2Area: "basic_device_obj",
                object1: detailsDeviceById.studio3T_device,
                object2: detailsDeviceById.basic_device_obj
            }, // studio3T_device thiếu "apLocationLldp", basic_device_obj ko có 16 field

            {
                title: "route: detailsDeviceById - prop: all - area:  Postman (mine) 3 VS deviceAndDynamicAndExtra_detailsDeviceById",
                object1Area: "Postman (mine) 3",
                object2Area: "deviceAndDynamicAndExtra_detailsDeviceById",
                object1: detailsDeviceById.postman_mine3,
                object2: deviceAndDynamicAndExtra_detailsDeviceById
            }, // postman mine 3 thiếu 5 field 
            // [
            //     'apLocation',
            //     'deviceLicenseMode',
            //     'meshLevel',
            //     'rootMacAddress',
            //     'rootMacFriendlyName'
            //   ]

            {
                title: "route: detailsDeviceById - prop: all - area:  Postman txt VS deviceAndDynamicAndExtra_detailsDeviceById",
                object1Area: "Postman txt",
                object2Area: "deviceAndDynamicAndExtra_detailsDeviceById",
                object1: detailsDeviceById.postman_txt,
                object2: deviceAndDynamicAndExtra_detailsDeviceById
            }, //  postman txt thiếu 2 field: 'deviceLicenseMode', 'rootMacFriendlyName'

            {
                title: "route: getDeviceById - prop: all - area:  postman_mine VS deviceAndDynamicAndExtra_getDeviceById",
                object1Area: "postman_mine",
                object2Area: "deviceAndDynamicAndExtra_getDeviceById",
                object1: getDeviceById.postman_mine,
                object2: deviceAndDynamicAndExtra_getDeviceById
            }, // postman mine thiếu 5 field
            // [
            //     'apLocation',
            //     'deviceLicenseMode',
            //     'meshLevel',
            //     'rootMacAddress',
            //     'rootMacFriendlyName'
            //   ] 

            {
                title: "route: getAllDevicesFromOrganization - prop: all - area:  postman_mine VS deviceAndDynamicAndExtra_getAllDevicesFromOrganization",
                object1Area: "postman_mine",
                object2Area: "deviceAndDynamicAndExtra_getAllDevicesFromOrganization",
                object1: getAllDevicesFromOrganization.postman_mine,
                object2: deviceAndDynamicAndExtra_getAllDevicesFromOrganization
            }, // postman mine thiếu 5 field
            // [
            //     'apLocation',
            //     'deviceLicenseMode',
            //     'meshLevel',
            //     'rootMacAddress',
            //     'rootMacFriendlyName'
            //   ] 

            {
                title: "route: getAllDevices - prop: all - area:  postman_mine VS deviceAndDynamicAndExtra_getAllDevices",
                object1Area: "postman_mine",
                object2Area: "deviceAndDynamicAndExtra_getAllDevices",
                object1: getAllDevices.postman_mine,
                object2: deviceAndDynamicAndExtra_getAllDevices
            }, // postman mine thiếu 5 field
            // [
            //     'apLocation',
            //     'deviceLicenseMode',
            //     'meshLevel',
            //     'rootMacAddress',
            //     'rootMacFriendlyName'
            //   ] 

            // site: schema thiếu 'location', 'organization'
            // group: schema thừa 'isDefault'
            // license: schema thiếu quá nhiều, thừa "organization". license studio3T: thiếu 'remainingDuration'
        ];

        const logItems = [7];

        consoleLogForms.compareObjectPairs_Diff(objectPairsArray, logItems);

        // consoleLogForms.compareObjectPair_InBoth(detailsDeviceById.studio3T_device, detailsDeviceById.studio3T_devicedynamicattribute);
        // [
        //     '_id',            'createdAt',
        //     'description',    'lastSeenTime',
        //     'location',       'macAddress',
        //     'name',           'serialNumber',
        //     'updatedAt',      'version',
        //     'vpnSettingName', 'workingMode'
        //   ] ( 12 fields )

        // const a = detailsDeviceById.studio3T_devicedynamicattribute;
        // const a = detailsDeviceById.studio3T_device;
        // const a = detailsDeviceById.extra_when_get_details;
        // const a = getAllDevicesFromOrganization.extraWhenGetAllDevicesFromOrg;
        // const a = getDeviceById.extraWhenGetDeviceById;
        const a = getAllDevices.extraWhenGetAllDevices;
        const b = detailsDeviceById.fixed_schema;
        functions.assignValueOfTheSameProp(a, b);
        functions.writeToAFile(a);
    } catch (error) {
        console.log("error: ", error);
    }
}

test();