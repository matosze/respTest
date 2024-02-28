document.addEventListener('DOMContentLoaded', function() {
    window.populate200 = function() {
        document.getElementById('inputStatusCode').value = 200;
        document.getElementById('inputJson').value = JSON.stringify({
            "contacts": [
                // Your predefined JSON object for status 200
            ]
        }, null, 2); // Format the JSON for readability
    };

    window.populate500 = function() {
        document.getElementById('inputStatusCode').value = 500;
        document.getElementById('inputJson').value = JSON.stringify({
            // Your predefined JSON object for status 500
        }, null, 2); // Format the JSON for readability
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
            let fullPath;
            if (path) {
                fullPath = path + '.' + key;
            } else {
                fullPath = key;
            }
            if (obj[key] !== null && typeof obj[key] === 'object') {
                if (Array.isArray(obj[key])) {
                    obj[key].forEach((item, index) => {
                        if (typeof item === 'object') {
                            script += generateTests(item, `${fullPath}[${index}]`);
                        } else {
                            script += `pm.test(context + "Check ${fullPath}[${index}]", function() {
    pm.expect(jsonData.${fullPath}[${index}]).to.eql("${item}");
});\n`;
                        }
                    });
                } else {
                    script += generateTests(obj[key], fullPath);
                }
            } else {
                script += `pm.test(context + "Check ${fullPath}", function() {
    pm.expect(jsonData.${fullPath}).to.eql("${obj[key]}");
});\n`;
            }
        });
        return script;
    }
});
