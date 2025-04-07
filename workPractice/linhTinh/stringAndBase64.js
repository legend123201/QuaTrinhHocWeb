// Buffer is a object in Nodejs

const stringToBase64 = (string) => {
    const bufferFromString = Buffer.from(string);
    const base64 = bufferFromString.toString('base64');
    return base64;
}

const base64ToString = (base64) => {
    const bufferFromBase64 = Buffer.from(base64, 'base64')
    const string = bufferFromBase64.toString();
    return string;
}

// kubectl edit configmap ovng-backend
// ktra bằng lệnh này: kubectl get configmap ovng-backend -o jsonpath='{.data}'
// SERVICE_MANAGER_URL: https://acceptance.license-provider.datalake.systems (all system)
// WEBHOOK_URL: https://preview.manage.ovcirrus.com (system Preview)

// kubectl edit secret ovng-backend-secret
// ktra bằng lệnh này: kubectl get secret ovng-backend-secret -o jsonpath='{.data}'
// SERVICE_MANAGER_API_KEY: NXFmeUZMWE5ZNGFIS28zTkhIaGNpMmFOb3ZGTHVUd3cxZWJtdFRvcw== (all system)
// WEBHOOK_APIKEY: MGIyZGRmYTUtYWQ1My00NDg1LWJlZTctNTQ5YTY4ODdmNTY1 (system Preview)

// note các Webhook api_key để copy cho nhanh
// system dev: 1745969a-0e76-4a18-ba1d-9d5008ccdd8b
// system han2: 

console.log(stringToBase64("0IZBSBd7Bq6UaxvRZ9JTs18sGkYuoc857XuqK6Dn\n"));
console.log(stringToBase64("0IZBSBd7Bq6UaxvRZ9JTs18sGkYuoc857XuqK6Dn"));

console.log(base64ToString("NGQyMDhjZDYtYzgwNS00Nzk1LTkyZTktM2YxZTA4YmRmNGYz")); // admin
console.log(base64ToString("OWFkZjg1YWUtNzExZC00ZmQyLWEzZWQtMDA3MmNhODFlYTA1")); // supporter

console.log(base64ToString("Y2dMd01JKkt4WEZuTkJldW0yVyE="));