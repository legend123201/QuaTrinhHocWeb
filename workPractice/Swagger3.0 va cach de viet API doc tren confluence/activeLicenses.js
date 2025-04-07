const writeToAFile = require("../workPractice/comparePropsInObjects/functions/writeToAFile");

// ------------------ REQUEST PARAMETER
const requestParameter = [
    {
        "in": "header",
        "name": "Authorization",
        "required": true,
        "schema": {
            "type": "string"
        },
        "example": "APIKEY 9e690633-3add-4fc9-9d30-0da4d18d06e0",
        "description": "API Key for authentication."
    },
    {
        "in": "path",
        "name": "orgId",
        "required": true,
        "schema": {
            "type": "string"
        },
        "example": "6272357dfa6ef5018379ed89",
        "description": "The id of the organization."
    },
    {
        "in": "path",
        "name": "orderId",
        "required": true,
        "schema": {
            "type": "string"
        },
        "example": "NaaS-202204000352",
        "description": "The id of the order."
    }
]

// ------------------ REQUEST BODY
const requestBodySchema = {
    "type": "object",
    "required": ["gracePeriodDuration", "licenses"],
    "properties": {
        gracePeriodDuration: {
            type: "integer",
            description: "The grace period duration in the license."
        },
        licenses: {
            type: "array",
            description: "The array of results of licenses activation from SM.",
            items: {
                type: "object",
                required: ["license_id", "state", "start_date", "end_date", "activation_status", "duration"],
                properties: {
                    license_id: {
                        type: "string",
                        description: "The id of the license."
                    },
                    state: {
                        type: "string",
                        description: "The state of the license after active."
                    },
                    start_date: {
                        type: "string",
                        description: "The day which the license was activated."
                    },
                    end_date: {
                        type: "string",
                        description: "The day which the license expired."
                    },
                    activation_status: {
                        type: "string",
                        description: "the result of activation.",
                        enum: ["SUCCESS", "FAIL"]
                    },
                    duration: {
                        type: "number",
                        description: "The duration of the license."
                    }
                }
            }
        }
    }
};

const requestBodyExample = {
    "grace_period_duration": 3,
    "licenses": [
        {
            "start_date": "2023-03-10",
            "end_date": "2023-08-29",
            "license_id": "trial-license-91802c38-1865-47e3-afe2-1a18750c3ad0",
            "state": "active",
            "duration": 12,
            "activation_status": "SUCCESS"
        },
        {
            "start_date": "2023-03-10",
            "end_date": "2023-08-29",
            "license_id": "trial-license-01777c38-1865-47e3-afe2-1a18750kl788",
            "state": "active",
            "duration": 12,
            "activation_status": "SUCCESS"
        }
    ]
};

// ------------------ RESPONSE
const response200Schema = {
    type: "object",
    properties: {
        status: {
            type: "integer",
            description: "HTTP Status Code associated to the response. (200)"
        },
        message: {
            type: "string",
            description: "Status message associated to the response."
        },
        data: {
            type: "array",
            description: "The array of results of licenses activation data sync up.",
            items: {
                type: "object",
                properties: {
                    license_id: {
                        type: "string",
                        description: "The id of the license."
                    },
                    status: {
                        type: "string",
                        description: "The status of the license."
                    },
                    state: {
                        type: "string",
                        description: "The state of the license after active."
                    },
                    start_date: {
                        type: "string",
                        description: "The day which the license was activated."
                    },
                    end_date: {
                        type: "string",
                        description: "The day which the license expired."
                    },
                    duration: {
                        type: "number",
                        description: "The duration of the license."
                    },
                    site: {
                        type: "string",
                        description: "The id of the site that the license is used in."
                    }
                }
            }
        }
    }

};

const response200Example = {
    "status": 200,
    "message": "Sync activate licenses successfully.",
    "data": [
        {
            "licenseId": "trial-license-91802c38-1865-47e3-afe2-1a18750c3ad0",
            "status": "UNDER_TEASER",
            "duration": "3",
            "state": "active",
            "startDate": "2023-03-10",
            "endDate": "2023-08-29",
            "site": "6400290646d3c1a30989c3f7"
        },
        {
            "licenseId": "trial-license-00122c38-1865-47e3-afe2-1a18750caa99",
            "status": "UNDER_TEASER",
            "duration": "3",
            "state": "active",
            "startDate": "2023-03-10",
            "endDate": "2023-08-29",
            "site": "6400290646d3c1a30989c3f7"
        }
    ]
};

// content copy from OVNG Backend, có chỉnh sửa 1 chút phần examples (ko lồng trong application/json)
const otherResponseData = {
    "400": {
        description: "Bad Request",
        schema: {
            type: "object",
            properties: {
                errorCode: {
                    type: "integer",
                    description: "HTTP Error Code associated to the response. (400)"
                },
                errorMsg: {
                    type: "string",
                    description: "HTTP Status message associated to the error code. (Bad Request)"
                },
                errors: {
                    type: "array",
                    description: "Array of objects that contains the list of errors.",
                    items: {
                        type: "object",
                        properties: {
                            type: {
                                type: "string",
                                description: "Error type."
                            },
                            field: {
                                type: "string",
                                description: "Field name that has generated the error."
                            },
                            errorMsg: {
                                type: "string",
                                description: "Error message associated to the error."
                            }
                        }
                    }
                }
            }
        },
        examples: {
            errorCode: 400,
            errorMsg: "Bad Request",
            errors: [
                {
                    type: "any.required",
                    field: "<AttributeName>",
                    errorMsg: "<AttributeName> is required"
                }
            ]
        }
    },
    "401": {
        description: "Unauthorized",
        schema: {
            type: "object",
            properties: {
                errorCode: {
                    type: "integer",
                    description: "HTTP Error Code associated to the response. (401)"
                },
                errorMsg: {
                    type: "string",
                    description: "HTTP Status message associated to the error code. (Unauthorized)"
                },
                errorDetailsCode: {
                    type: "string",
                    description: "A unique key string identifying the error. Can be used by consumer to identify the error."
                },
                errorDetails: {
                    type: "string",
                    description: "A string value indicating why the access has been unauthorized."
                }
            }
        },
        examples: {
            errorCode: 401,
            errorMsg: "Unauthorized",
            errorDetailsCode: "invalid_token",
            errorDetails: "The access token provided is expired, revoked, malformed, or invalid for other reasons."
        }
    },
    "404": {
        description: "Not Found",
        schema: {
            type: "object",
            properties: {
                errorCode: {
                    type: "integer",
                    description: "HTTP Error Code associated to the response. (404)"
                },
                errorMsg: {
                    type: "string",
                    description: "Error message associated to the response. (Not Found)"
                },
                errorResourceName: {
                    type: "string",
                    description: "Error ressource name associated to the response. (Not Found)"
                },
                errorPropertyName: {
                    type: "string",
                    description: "Error property name associated to the response. (Not Found)"
                },
                errorDetails: {
                    type: "string",
                    description: "A string value indicating which resource has not been found."
                }
            }
        },
        examples: {
            errorCode: 404,
            errorMsg: "Resource Not Found",
            errorResourceName: "ResourceName",
            errorPropertyName: "<AttributeName>",
            errorDetails: "No resource found with <AttributeName>: <attributeValue>"
        }
    },
    "500": {
        description: "Server Error",
        schema: {
            type: "object",
            properties: {
                errorCode: {
                    type: "integer",
                    description: "HTTP Error Code associated to the response. (500)"
                },
                errorMsg: {
                    type: "string",
                    description: "Error message associated to the response."
                },
                errorDetails: {
                    type: "object",
                    description: "An object containing data associated to the error."
                }
            }
        },
        examples: {
            errorCode: 500,
            errorMsg: "Server Error",
            errorDetails: {}
        }
    }
};

// ------------------ MAIN
const main = {
    "openapi": "3.0.1",
    "info": {
        "title": "OVNG Backend API",
        "description": "This is API documentation about OVNG sync-up with SM on the license activation .",
        "version": "1.0.0"
    },
    "servers": [
        {
            "url": "https://manage.ovcirrus.com"
        }
    ],
    "tags": [
        {
            "name": "License",
            "description": "Interact with licenses from SM.",
            "externalDocs": {
                "description": "Find out more",
                "url": "https://jira.ale-international.com/browse/OVNG-3895"
            }
        }
    ],
    "paths": {
        "/api/licenses": {
            "post": {
                "tags": [
                    "License"
                ],
                "summary": "Sync up activation in licenses",
                "description": "This API allows to sync up activation in licenses.",
                "parameters": requestParameter,
                "requestBody": {
                    "description": "License request body",
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": requestBodySchema,
                            "example": requestBodyExample
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Sync up license activation data successfully.",
                        "content": {
                            "application/json": {
                                "schema": response200Schema,
                                "example": response200Example
                            }
                        }
                    },

                    "400": {
                        "description": otherResponseData["400"].description,
                        "content": {
                            "application/json": {
                                "schema": otherResponseData["400"].schema,
                                "example": otherResponseData["400"].examples
                            }
                        }
                    },

                    "401": {
                        "description": otherResponseData["401"].description,
                        "content": {
                            "application/json": {
                                "schema": otherResponseData["401"].schema,
                                "example": otherResponseData["401"].examples
                            }
                        }
                    },

                    "404": {
                        "description": otherResponseData["404"].description,
                        "content": {
                            "application/json": {
                                "schema": otherResponseData["404"].schema,
                                "example": otherResponseData["404"].examples
                            }
                        }
                    },

                    "500": {
                        "description": otherResponseData["500"].description,
                        "content": {
                            "application/json": {
                                "schema": otherResponseData["500"].schema,
                                "example": otherResponseData["500"].examples
                            }
                        }
                    }

                }
            }
        }
    },
}

// const mainAfterFix = main.replaceAll("items", "item");

writeToAFile(main, false);