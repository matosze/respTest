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
});

`;

        // Dynamically generate tests for each field in the JSON
        Object.keys(responseBody).forEach(key => {
            const value = responseBody[key];
            // For simplicity, assuming all values are expected to be strings.
            // You can add logic to handle different expected types.
            testScript += `pm.test(context + "Check ${key}", function() {
    pm.expect(jsonData.${key}).to.eql("${value}");
});\n`;
        });

        document.getElementById('output').textContent = testScript;
    } catch (e) {
        document.getElementById('output').textContent = 'Invalid JSON input. Error: ' + e.message;
    }
}
