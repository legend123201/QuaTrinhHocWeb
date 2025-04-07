// NOTE: 
// web copy của anh Tâm: https://ale-nbd.atlassian.net/wiki/spaces/OVNGRD/pages/1069219893/OVNG-1344+ALE+License+Activation+Server+and+Device+Interaction+API
// - dùng https://editor-next.swagger.io/ để viết api doc, nó có thể chuyển từ json qua yaml rất ngon
// - swagger 3.0 thì các giá trị "required" của "type": "object" sẽ liệt kê trong 1 array, từng phần tử trỏng là từng field trong object cần required, ko có cách nào lấy tất cả thuộc tính cho nhanh, phải ghi từng field ra

// để chung với các prop "tags", "summary", ...
const b = {
    // auth đối với bản 3.0
    "security": [
        {
            "ApiKeyAuth": []
        }
    ],
    // auth đối với bản 2.0
    "parameters": [
        {
            "in": "header",
            "name": "Authorization",
            "required": true,
            "schema": {
                "type": "string"
            },
            "example": "APIKEY SAJDAKSDH",
            "description": "Bearer {{access_token}}"
        }
    ],
};

// để trong "components"
const c = {
    // auth đối với bản 3.0
    "securitySchemes": {
        "ApiKeyAuth": {
            "type": "apiKey",
            "in": "header",
            "name": "X-API-KEY"
        }
    },
}

const a = {
    "openapi": "3.0.1",
    "info": {
        "title": "ALE License Activation Server API",
        "description": "This is license activation server API documentation.",
        "version": "1.0.0"
    },
    "servers": [
        {
            "url": "https://license.myovcloud.com/"
        }
    ],
    "tags": [
        {
            "name": "callhome",
            "description": "Interact with ALE LAS to download license details",
            "externalDocs": {
                "description": "Find out more",
                "url": "https://jira.ale-international.com/browse/OVNG-1344"
            }
        }
    ],
    "paths": {
        "/api/licenses": {
            "post": {
                "tags": [
                    "callhome"
                ],
                "summary": "Call Home to get license details (Switch/AP -> AS)",
                "description": "Message exchange and message contents to be exchanged between AOS license client and ALE license activation server",
                "requestBody": {
                    "description": "License request body",
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "required": [
                                    "contents"
                                ],
                                "properties": {
                                    "messageId": {
                                        "type": "integer",
                                        "description": "Message id of the request, at this time LAS don't case this value"
                                    },
                                    "method": {
                                        "type": "string",
                                        "enum": [
                                            "callhome"
                                        ],
                                        "description": "Callhome method to LAS, at this time LAS don't case this value"
                                    },
                                    "contents": {
                                        "type": "object",
                                        "required": [
                                            "devices"
                                        ],
                                        "properties": {
                                            "devices": {
                                                "type": "array",
                                                "items": {
                                                    "type": "object",
                                                    "required": [
                                                        "serialNumber",
                                                        "fingerprint",
                                                        "hash"
                                                    ],
                                                    "properties": {
                                                        "serialNumber": {
                                                            "type": "string",
                                                            "description": "Device serial number"
                                                        },
                                                        "fingerprint": {
                                                            "type": "string",
                                                            "description": "Fingerprint to be sent by devices alongwith S/N in the call-home request. This fingerprint is to be used by SM to generate the device entitlement through EMS. <br/>In Nation, we will follow this option: <ul><li>Devices continue to send Fingerprint in the call-home request. But OVNG LAS doesn’t pass these Fingeprints to SM. SM will generate Fingerprint locally by using portions of software code extracted from FIT-SDK</li></ul>"
                                                        },
                                                        "hash": {
                                                            "type": "string",
                                                            "description": "A secrect hash value for device serial number used to validate with LAS (same as OVC call-home with hash today)",
                                                            "format": "base64"
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "example": {
                                "messageId": 1,
                                "method": "callhome",
                                "contents": {
                                    "devices": [
                                        {
                                            "serialNumber": "P468057A",
                                            "fingerprint": "RnRtZgEAAADg3G0Wk4kDenRTc0qxGGxB",
                                            "hash": "8BD2FE41DC33E0581CF9D85A5F137929FA280233CA5B603E4108CFAD9CE00430"
                                        },
                                        {
                                            "serialNumber": "P468057B",
                                            "fingerprint": "RnRtZgEAAAD6OmBq4Iywss+V4VNQhdBy",
                                            "hash": "DF32D35D5F5E96D474285E67C4934A9A1F2C9652E48F5486AEF7201F58BB44AD"
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Partial success, just found some of licenses for the list of serial number",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/PartialLicenseResponse"
                                },
                                "example": {
                                    "messageId": 3,
                                    "method": "callhomeResponse",
                                    "contents": {
                                        "callHomePeriod": 300,
                                        "devices": [
                                            {
                                                "serialNumber": "P468057A",
                                                "mode": "NAAS",
                                                "licenses": [
                                                    "RnRtZgEAAABQSPO8VLoAvrn8in9yonf1",
                                                    "RnRtZgEAAABQSPO8VLoAvrn8in9yonf3"
                                                ]
                                            },
                                            {
                                                "serialNumber": "P468057B",
                                                "mode": "CAPEX",
                                                "licenses": []
                                            },
                                            {
                                                "serialNumber": "401INVALID",
                                                "error": {
                                                    "description": "Invalid credentials",
                                                    "error": "Unauthorized",
                                                    "status_code": 401
                                                }
                                            },
                                            {
                                                "serialNumber": "404NOTFOUND",
                                                "error": {
                                                    "description": "License not found",
                                                    "error": "NotFound",
                                                    "status_code": 404
                                                }
                                            },
                                            {
                                                "serialNumber": "409CONFLICT",
                                                "error": {
                                                    "description": "Insufficient data",
                                                    "error": "Conflict",
                                                    "status_code": 409
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    "201": {
                        "description": "Found all licenses for the list of serial number",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/LicenseResponse"
                                },
                                "example": {
                                    "messageId": 2,
                                    "method": "callhomeResponse",
                                    "contents": {
                                        "callHomePeriod": 300,
                                        "devices": [
                                            {
                                                "serialNumber": "P468057A",
                                                "mode": "NAAS",
                                                "licenses": [
                                                    "RnRtZgEAAABQSPO8VLoAvrn8in9yonf1",
                                                    "RnRtZgEAAABQSPO8VLoAvrn8in9yonf3"
                                                ]
                                            },
                                            {
                                                "serialNumber": "P468057B",
                                                "mode": "CAPEX",
                                                "licenses": []
                                            },
                                            {
                                                "serialNumber": "P4111111",
                                                "mode": "UNKNOWN ",
                                                "licenses": []
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Conflict or insufficient data, required attributes are missing",
                        "content": {
                            "application/json": {
                                "example": {
                                    "description": "Insufficient data",
                                    "error": "BadRequest",
                                    "status_code": 400
                                },
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "All the given fingerprints are invalid or do not match with the corresponding serial number",
                        "content": {
                            "application/json": {
                                "example": {
                                    "description": "Invalid credentials",
                                    "error": "Unauthorized",
                                    "status_code": 401
                                },
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "404": {
                        "description": "The requested resource could not be found",
                        "content": {
                            "application/json": {
                                "example": {
                                    "description": "Requested resource is not found",
                                    "error": "NotFound",
                                    "status_code": 404
                                },
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "content": {
                            "application/json": {
                                "example": {
                                    "description": "Internal server error",
                                    "error": "InternalError",
                                    "status_code": 500
                                },
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "components": {
        "schemas": {
            "ErrorResponse": {
                "type": "object",
                "properties": {
                    "description": {
                        "type": "string",
                        "description": "Error description"
                    },
                    "error": {
                        "type": "string",
                        "description": "Error code name"
                    },
                    "status_code": {
                        "type": "integer",
                        "description": "HTTP error code"
                    }
                }
            },
            "LicenseResponse": {
                "type": "object",
                "description": "License resposne captured from Service Manager, LAS will simply pass it to device for processing",
                "properties": {
                    "messageId": {
                        "type": "integer",
                        "description": "Message ID got from Service Manager, LAS do not care this value"
                    },
                    "method": {
                        "type": "string",
                        "description": "Response body category got from Service Manager, LAS do not care this value",
                        "enum": [
                            "callhomeResponse"
                        ]
                    },
                    "contents": {
                        "type": "object",
                        "properties": {
                            "callHomePeriod": {
                                "type": "integer",
                                "description": "Device must continue trying to connect to ALE License Activation Server with the Periodic call-home, time is in second"
                            },
                            "devices": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "serialNumber": {
                                            "type": "string",
                                            "description": "Serial number having license associated"
                                        },
                                        "mode": {
                                            "type": "string",
                                            "enum": [
                                                "NAAS",
                                                "CAPEX",
                                                "UNKNOWN"
                                            ],
                                            "description": "License mode, if UNKNOWN, ‘license’ attribute below will be empty"
                                        },
                                        "licenses": {
                                            "type": "array",
                                            "description": "List of license associated to the serial numbe. The value is in base64 encoded value",
                                            "items": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "PartialLicenseResponse": {
                "type": "object",
                "description": "License resposne captured from Service Manager, LAS will simply pass it to device for processing",
                "properties": {
                    "messageId": {
                        "type": "integer",
                        "description": "Message ID got from Service Manager, LAS do not care this value"
                    },
                    "method": {
                        "type": "string",
                        "description": "Response body category got from Service Manager, LAS do not care this value",
                        "enum": [
                            "callhomeResponse"
                        ]
                    },
                    "contents": {
                        "type": "object",
                        "properties": {
                            "callHomePeriod": {
                                "type": "integer",
                                "description": "Device must continue trying to connect to ALE License Activation Server with the Periodic call-home, time is in second"
                            },
                            "devices": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "serialNumber": {
                                            "type": "string",
                                            "description": "Serial number having license associated"
                                        },
                                        "error": {
                                            "$ref": "#/components/schemas/ErrorResponse"
                                        },
                                        "mode": {
                                            "type": "string",
                                            "enum": [
                                                "NAAS",
                                                "CAPEX",
                                                "UNKNOWN"
                                            ],
                                            "description": "License mode, if UNKNOWN, ‘license’ attribute below will be empty"
                                        },
                                        "licenses": {
                                            "type": "array",
                                            "description": "List of license associated to the serial numbe. The value is in base64 encoded value",
                                            "items": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}