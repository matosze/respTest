document.addEventListener('DOMContentLoaded', function () {

    window.populate200 = function () {
        document.getElementById('inputStatusCode').value = 200;
        document.getElementById('inputJson').value = JSON.stringify({
            "contacts": [
                {
                    "customerReference": 7,
                    "docType": "101",
                    "docReference": "3094618",
                    "docCountryCode": "PRT",
                    "shortname": "AGÊNCIA FUNERÁRIA",
                    "returnedMailIndicator": "N",
                    "customerType": "P",
                    "contactStatus": "A",
                    "contactType": "0301",
                    "contactTypeDescription": "CORR.ELECTR.PESSOAL",
                    "contactSeq": 8,
                    "contact": "TIAGO.NORONHA@UNIPARTNER.COM",
                    "contactExtension": "",
                    "contactStartDate": "0000",
                    "contactEndDate": "0000",
                    "contactStartDate2": "0000",
                    "contactEndDate2": "0000",
                    "relativesContact": "N",
                    "serviceContact": false,
                    "certificationStatus": "PENDING",
                    "countryCode": ""
                },
                {
                    "customerReference": 7,
                    "docType": "101",
                    "docReference": "3094618",
                    "docCountryCode": "PRT",
                    "shortname": "AGÊNCIA FUNERÁRIA",
                    "returnedMailIndicator": "N",
                    "customerType": "P",
                    "contactStatus": "A",
                    "contactType": "0301",
                    "contactTypeDescription": "CORR.ELECTR.PESSOAL",
                    "contactSeq": 9,
                    "contact": "VER DETALHE",
                    "contactExtension": "",
                    "contactStartDate": "0000",
                    "contactEndDate": "0000",
                    "contactStartDate2": "0000",
                    "contactEndDate2": "0000",
                    "relativesContact": "N",
                    "serviceContact": false,
                    "certificationStatus": "NOT_CERTIFIED",
                    "countryCode": ""
                },
                {
                    "customerReference": 7,
                    "docType": "101",
                    "docReference": "3094618",
                    "docCountryCode": "PRT",
                    "shortname": "AGÊNCIA FUNERÁRIA",
                    "returnedMailIndicator": "N",
                    "customerType": "P",
                    "contactStatus": "A",
                    "contactType": "0302",
                    "contactTypeDescription": "CORR.ELECTR.EMPREGO",
                    "contactSeq": 4,
                    "contact": "JPRODRIGUES@MONTEPIO.PT",
                    "contactExtension": "",
                    "contactStartDate": "0000",
                    "contactEndDate": "0000",
                    "contactStartDate2": "0000",
                    "contactEndDate2": "0000",
                    "relativesContact": "N",
                    "serviceContact": false,
                    "certificationStatus": "NOT_CERTIFIED",
                    "countryCode": ""
                }
            ]
        }, null, 2); // Format the JSON for readability
        generateTestScript();
    };

    window.populate500 = function () {
        document.getElementById('inputStatusCode').value = 500;
        document.getElementById('inputJson').value = JSON.stringify({
            "message": "A Generic Technical error has occurred",
            "code": "TECHNICAL_ERROR",
            "detail": "Required request parameter 'score' for method parameter type Double is present but converted to null",
            "causingSystemName": "/override-google-lock",
            "causingSystemErrorCode": "org.springframework.web.bind.MissingServletRequestParameterException",
            "causingSystemMessage": "Required request parameter 'score' for method parameter type Double is present but converted to null",
            "datetime": "2024-02-28 17:31:30"
        }, null, 2); // Format the JSON for readability
        generateTestScript();
    };

    window.copyToClipboard = function () {
        const outputText = document.getElementById('output').textContent;
        navigator.clipboard.writeText(outputText).then(function () {
            console.log('Copying to clipboard was successful!');
        }, function (err) {
            console.error('Could not copy text: ', err);
        });
    };

    // Function to create and append status code buttons
    function createStatusCodeButton(code) {
        const btn = document.createElement("button");
        btn.textContent = code; // Set button text to the status code
        btn.onclick = function () {
            populateStatusCode(code);
        }; // Set onclick behavior
        document.getElementById("statusButtons").appendChild(btn); // Append button to the container
    }

    // Array of common 400 and 500 status codes
    const commonStatusCodes = [
        200,
        400, 401, 403, 404, 405, 406, 407, 408, 409, 410, // Common 400 range codes
        500, 501, 502, 503, 504  // Common 500 range code
    ];

    // Generate buttons for each common status code
    commonStatusCodes.forEach(createStatusCodeButton);

    // Example: Populate status code function (ensure you have this implemented)
    window.populateStatusCode = function (code) {
        document.getElementById('inputStatusCode').value = code;
        generateTestScript();
    };

    function generateJsonSchema(obj, title = "Root Schema") {
        let schema = {
            "type": "object",
            "title": title,
            "required": [],
            "properties": {}
        };

        for (let key in obj) {
            if (Array.isArray(obj[key])) {
                let arrayItemType = typeof obj[key][0];
                if (obj[key].length === 0) {
                    schema.properties[key] = { type: "array", items: {} };
                } else if (arrayItemType === 'object') {
                    schema.properties[key] = {
                        type: "array",
                        items: generateJsonSchema(obj[key][0], `${key} Item Schema`)
                    };
                } else {
                    schema.properties[key] = {
                        type: "array",
                        items: { type: arrayItemType }
                    };
                }
            } else if (typeof obj[key] === "object" && obj[key] !== null) {
                schema.properties[key] = generateJsonSchema(obj[key], `${key} Schema`);
            } else {
                // Here we simplify the handling by considering every number as type "number"
                let propType = typeof obj[key] === 'number' ? "number" : typeof obj[key];
                schema.properties[key] = { type: propType };
                schema.required.push(key);
            }
        }

        return schema;
    }


    window.generateTestScript = function() {
        const inputStatusCode = document.getElementById('inputStatusCode').value;
        const inputJson = document.getElementById('inputJson').value;
        try {
            const responseBody = JSON.parse(inputJson);
            let schema = generateJsonSchema(responseBody); // Generate the JSON Schema based on input
            let fieldTests = generateTests(responseBody, '', true); // Root call

            let testScript = `const context = pm.info.requestName + " | ";
const response = pm.response.json();\n\n`;

            testScript += `pm.test(context + "Status code is ${inputStatusCode}", function () {
    pm.response.to.have.status(${inputStatusCode});
});\n\n`;

            testScript += `pm.test(context + "Validate response body JSON", function () {
    pm.response.to.be.json;
    console.log(response);
});\n\n`;

            // Add field-level tests generated by generateTests
            testScript += fieldTests;

            // Include the generated JSON Schema in the test script
            testScript += `const schema = ${JSON.stringify(schema, null, 4)};\n\n`;

            // Add JSON Schema validation test
            testScript += `pm.test(context + ' Schema is valid', function() {
    pm.response.to.have.jsonSchema(schema);       
});\n\n`;

            document.getElementById('output').textContent = testScript;
        } catch (e) {
            document.getElementById('output').textContent = 'Invalid JSON input. Error: ' + e.message;
        }
    };


    function generateTests(obj, path, isRoot = false) {
        let script = '';
        if (isRoot) {
            script += `pm.test('${path || 'Validate response fields'}', function() {\n`;
        }

        const keys = Object.keys(obj);
        keys.forEach((key, index) => {
            const fullPath = path ? `${path}.${key}` : key;
            const isLastElement = index === keys.length - 1;

            if (Array.isArray(obj[key])) {
                if (obj[key].length > 0 && typeof obj[key][0] === 'object') {
                    script += `    // Tests for the first element of ${fullPath}\n`;
                    script += generateTests(obj[key][0], `${fullPath}[0]`, false);
                    if (obj[key].length > 1) {
                        script += `    // Tests for the last element of ${fullPath}\n`;
                        script += generateTests(obj[key][obj[key].length - 1], `${fullPath}[${obj[key].length - 1}]`, false);
                    }
                }
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                script += generateTests(obj[key], fullPath, false);
            } else {
                script += `    pm.expect(response.${fullPath}).to.eql(${JSON.stringify(obj[key])});\n`;
            }
        });

        if (isRoot) {
            script += '});\n\n';
        }
        return script;
    }

    document.getElementById('inputJson').addEventListener('input', generateTestScript);
    // Attach the event listener to the copy button
    document.getElementById('copyButton').addEventListener('click', copyToClipboard);
    document.getElementById('inputStatusCode').addEventListener('change', generateTestScript);

    document.getElementById('output').addEventListener('click', function () {
        const outputText = this.textContent;
        navigator.clipboard.writeText(outputText).then(function () {
            console.log('Copying to clipboard was successful!');
        }, function (err) {
            console.error('Could not copy text: ', err);
        });
    });
}); 
