document.addEventListener('DOMContentLoaded', function() {
    window.populate200 = function() {
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
    };

    window.populate500 = function() {
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
    };

    fetch('https://api.github.com/repos/matosze/respTest/commits?per_page=1')
    .then(response => response.json())
    .then(data => {
        const lastCommitDate = new Date(data[0].commit.committer.date);
        // Format the date in Portuguese
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const formattedDate = lastCommitDate.toLocaleString('pt-PT', options);
        document.getElementById('lastCommitDate').textContent = `Última atualização: ${formattedDate}`;
    })
    .catch(console.error);

    // Function to create and append status code buttons
    function createStatusCodeButton(code) {
        const btn = document.createElement("button");
        btn.textContent = code; // Set button text to the status code
        btn.onclick = function() { populateStatusCode(code); }; // Set onclick behavior
        document.getElementById("statusButtons").appendChild(btn); // Append button to the container
    }

    // Array of common 400 and 500 status codes
    const commonStatusCodes = [
        400, 401, 403, 404, 405, 406, 407, 408, 409, 410, // Common 400 range codes
        500, 501, 502, 503, 504  // Common 500 range code
    ];

    // Generate buttons for each common status code
    commonStatusCodes.forEach(createStatusCodeButton);

    // Example: Populate status code function (ensure you have this implemented)
    window.populateStatusCode = function(code) {
        document.getElementById('inputStatusCode').value = code;
    };

    window.generateTestScript = function() {
        const inputStatusCode = document.getElementById('inputStatusCode').value;
        const inputJson = document.getElementById('inputJson').value;
        try {
            const responseBody = JSON.parse(inputJson);
            let testScript = `const context = pm.info.requestName + " | ";
const response = pm.response.json();

pm.test(context + "Status code is ${inputStatusCode}", function () {
    pm.response.to.have.status(${inputStatusCode});
});

pm.test(context + "Validate response body JSON", function () {
    pm.response.to.be.json;
    const jsonData = response; // Use the parsed response directly
    console.log(jsonData);
});\n\n`;

            testScript += generateTests(responseBody, '');

            document.getElementById('output').textContent = testScript;
        } catch (e) {
            document.getElementById('output').textContent = 'Invalid JSON input. Error: ' + e.message;
        }
    };

    function generateTests(obj, path) {
        let script = '';
        Object.keys(obj).forEach(key => {
            const fullPath = path ? `${path}.${key}` : key;
            if (obj[key] !== null && typeof obj[key] === 'object') {
                if (Array.isArray(obj[key])) {
                    // Process only the first element if it's an object, for arrays of the same type of objects
                    if (obj[key].length > 0 && typeof obj[key][0] === 'object') {
                        script += generateTests(obj[key][0], `${fullPath}[0]`);
                    }
                } else {
                    // Recursive call for nested objects
                    script += generateTests(obj[key], fullPath);
                }
            } else {
                // Directly compare values for non-objects and non-array elements
                script += `pm.test(context + "Check ${fullPath}", function() {
    pm.expect(jsonData.${fullPath}).to.eql("${obj[key]}");
});\n`;
            }
        });
        return script;
    }

    document.getElementById('inputJson').addEventListener('input', generateTestScript);
}); 
