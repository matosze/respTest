function generateTestScript() {
    const inputStatusCode = document.getElementById('inputStatusCode').value; // Get the status code from the input field
    const inputJson = document.getElementById('inputJson').value;

    try {
        // Assuming inputJson directly contains the response body JSON
        const responseBody = JSON.parse(inputJson); // Parse the JSON input

        // Generate the test script string, using template literals to embed the status code and response body correctly
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

// Add more dynamic generation logic based on the responseBody structure`;

        // Correctly place the generated script in the 'output' element
        document.getElementById('output').textContent = testScript;
    } catch (e) {
        document.getElementById('output').textContent = 'Invalid JSON input. Error: ' + e.message;
    }
}
