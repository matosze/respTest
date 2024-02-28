function generateTestScript() {
    const inputJson = document.getElementById('inputJson').value;
    try {
        const input = JSON.parse(inputJson);
        const httpCode = input.httpCode; // Assuming this is included in your JSON
        const responseBody = input.responseBody; // This should be the JSON response body as an object

        // Generate the test script
        const testScript = `const context = pm.info.requestName + " | ";
const response = pm.response.json();

pm.test(context + "Status code is ${httpCode}", function () {
    pm.response.to.have.status(${httpCode});
});

pm.test(context + "Validate response body JSON", function () {
    pm.response.to.be.json;
    const jsonData = JSON.parse(responseBody);
    console.log(jsonData);
});

// Add more dynamic generation logic based on the responseBody structure


        document.getElementById('output').textContent = testScript;
    } catch (e) {
        document.getElementById('output').textContent = 'Invalid JSON input';
    }
}
