function generateTestScript() {
    const inputJson = document.getElementById('inputJson').value;
    try {
        const input = JSON.parse(inputJson);
        const httpCode = input.httpCode; // Assuming this is included in your JSON
        const responseBody = JSON.stringify(input.responseBody); // Convert the responseBody object back to a string to include in the generated script

        // Generate the test script without including the line that updates the output element
        const testScript = `const context = pm.info.requestName + " | ";
const response = pm.response.json();

pm.test(context + "Status code is ${httpCode}", function () {
    pm.response.to.have.status(${httpCode});
});

pm.test(context + "Validate response body JSON", function () {
    pm.response.to.be.json;
    const jsonData = JSON.parse(\`${responseBody}\`); // Correctly insert the responseBody string
    console.log(jsonData);
});

// Add more dynamic generation logic based on the responseBody structure`;

        // Correctly update the output element here, outside the template literal
        document.getElementById('output').textContent = testScript;
    } catch (e) {
