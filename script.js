function generateTestScript() {
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
});\n`;

        // Function to recursively generate tests
        function generateTests(obj, path = '') {
            Object.keys(obj).forEach(key => {
                const newPath = path ? \`\${path}.\${key}\` : key;
                if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
                    // It's a nested object, recurse
                    generateTests(obj[key], newPath);
                } else if (Array.isArray(obj[key])) {
                    // It's an array. Generate tests for each item
                    obj[key].forEach((item, index) => {
                        if (typeof item === 'object') {
                            generateTests(item, \`\${newPath}[\${index}]\`);
                        } else {
                            // Directly compare the array item
                            testScript += `pm.test(context + "Check ${newPath}[${index}]", function() {
    pm.expect(jsonData.${newPath}[${index}]).to.eql("${item}");
});\n`;
                        }
                    });
                } else {
                    // Direct comparison
                    testScript += `pm.test(context + "Check ${newPath}", function() {
    pm.expect(jsonData.${newPath}).to.eql("${obj[key]}");
});\n`;
                }
            });
        }

        // Start the recursive generation of tests
        generateTests(responseBody);

        document.getElementById('output').textContent = testScript;
    } catch (e) {
        document.getElementById('output').textContent =
