function generateTestScript() {
    const inputJson = document.getElementById('inputJson').value;
    const inputStatusCode = document.getElementById('inputStatusCode').value; // Get the status code from the input field

    try {
        const responseBody = JSON.parse(inputJson); // Assuming the entire JSON is the response body

        // Generate the test script using the status code and response body
        const testScript = `const context = pm.info.requestName + " | ";
const response = pm.response.json();

pm.test(context + "Status code is ${inputStatusCode}", function () {
    pm.response.to.have.status(${inputStatusCode});
});

pm.test(context + "Validate response body JSON", function () {
    pm.response.to.be.json;
    const jsonData = JSON.parse(\`${JSON.stringify(responseBody)}\`);
    console.log(jsonData);
});

// Further tests can be dynamically generated based on the responseBody

document.getElementById('output').textContent = testScript;
    } catch (e) {
        document.getElementById('output').textContent = 'Invalid JSON input';
    }
}
